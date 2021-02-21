import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { mapPollVote } from '../../../functions/map-poll-vote.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { PollAnswer } from '../../../models/poll-answer.model';
import { PollVote } from '../../../models/poll-vote.model';
import { Poll } from '../../../models/poll.model';
import { Vars } from '../../../vars';

export async function voteForPollAnswer(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const incomingData = req.body;
    const incomingParams = req.params;
    const mappedIncomingData = mapPollVote(incomingData, incomingParams.pollAnswerId);

    const currentDate = new Date();
    // allow polls that expire today to be shown
    currentDate.setDate(currentDate.getDate() - 1);
    const pollData: Poll | null = await Poll
        .scope(
            [
                { method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] },
                { method: [ 'onlyAnswerTeam', Vars.currentUser.teams.map(t => t.id), Vars.currentOrganization.public_team_id ] },
                { method: [ 'notExpired', currentDate ] }
            ])
        .findByPk(incomingParams.pollId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollData === null) {
        return res.status(404).send(wrapResponse(false));
        //next(new CustomError(PortalErrors.NOT_FOUND, 404));
    }
    const pollAnswerData: PollAnswer | null = await PollAnswer.findOne(
        {
            where: {
                id: incomingParams.pollAnswerId,
                poll_id: pollData.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollAnswerData === null) {
        next(new CustomError(PortalErrors.NOT_FOUND, 404));
    }
    if (Vars.currentUser.voted_poll_answers.map(p => p.poll_id).find(el => el === pollData.id)) {
        next(new CustomError(PortalErrors.YOU_ALREADY_VOTED, 404));
    }

    const createdData = await PollVote.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.COULD_NOT_CREATE_POLLVOTE, 500));
    }

    return res.send(wrapResponse(true, createdData));
}