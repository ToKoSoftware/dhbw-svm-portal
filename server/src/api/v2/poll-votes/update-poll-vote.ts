import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { PollAnswer } from '../../../models/poll-answer.model';
import { PollVote } from '../../../models/poll-vote.model';
import { Vars } from '../../../vars';

export async function updatePollVote(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const pollAnswerId = req.params.pollAnswerId;
    const incomingData = req.body;

    const pollAnswerData: PollAnswer | null = await PollAnswer.scope('includePoll').findByPk(req.params.id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollAnswerData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'There is no active PollAnswer with the given id!' }));
        //next(new CustomError(PortalErrors.THERE_IS_NO_ACTIVE_POLLANSWER_WITH_THE_GIVEN_ID, 400));
    }
    if (pollAnswerData.poll.org_id !== Vars.currentOrganization.id) {
        next(new CustomError(PortalErrors.FORBIDDEN, 403));
    }

    const pollVoteData: PollVote | null = await PollVote.findOne(
        {
            where: {
                user_id: Vars.currentUser.id,
                poll_answer_id: pollAnswerId
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollVoteData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No PollVote with given id found' }));
        //next(new CustomError(PortalErrors.NO_POLLVOTE_WITH_GIVEN_ID_FOUND, 400));
    }

    if (!checkKeysAreNotEmptyOrNotSet(incomingData, [ 'body' ])) {
        next(new CustomError(PortalErrors.FIELDS_MUST_NOT_BE_EMPTY, 400));
    }

    pollVoteData.update(incomingData.title)
        .catch(() => {
            success = false;
            return [ 0, [] ];
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollVoteData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, pollVoteData));
}