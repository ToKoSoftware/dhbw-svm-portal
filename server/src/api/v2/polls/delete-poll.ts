import { NextFunction, Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Poll } from '../../../models/poll.model';
import { PollAnswer } from '../../../models/poll-answer.model';
import { PollVote } from '../../../models/poll-vote.model';
import { Vars } from '../../../vars';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import { PortalErrors } from '../../../enum/errors';
import { CustomError } from '../../../middleware/error-handler';

export async function deletePoll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const pollId: string = req.params.id;

    const pollData: Poll | null = await Poll.findByPk(pollId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No poll with given id found!' }));
        //next(new CustomError(PortalErrors.NO_POLL_WITH_GIVEN_ID_FOUND, 400));
    }

    const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
    if (!maintainedTeamIds.find(id => id == pollData.answer_team_id) && !Vars.currentUserIsAdmin) {
        next(new CustomError(PortalErrors.YOU_ARE_NOT_ALLOWED_TO_DELETE_A_POLL_FOR_A_TEAM_YOU_ARE_NOT_MAINTAINER_OF, 403));
    }

    await pollData.destroy()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        //return res.status(500).send(wrapResponse(false, { error: 'Could not delete poll with id ' + pollId }));
        next(new CustomError(PortalErrors.COULD_NOT_DELETE_POLL_WITH_ID, 500));
    }

    const pollAnswerData: PollAnswer[] = await PollAnswer.findAll(
        {
            where: {
                poll_id: pollId
            }
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success || pollAnswerData === []) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }

    const pollAnswerIds = pollAnswerData.map(p => p.id);

    pollAnswerData.forEach(pollAnswer => pollAnswer.destroy());

    await PollVote.destroy(
        {
            where: {
                poll_answer_id: pollAnswerIds
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        //return res.status(500).send(wrapResponse(false, { error: 'Could not delete PollVotes belonging to poll with id ' + pollId }));
        next(new CustomError(PortalErrors.COULD_NOT_DELETE_POLLVOTES_BELONGING_TO_POLL_WITH_ID, 500));
    }

    return res.status(204).send(wrapResponse(true));


}