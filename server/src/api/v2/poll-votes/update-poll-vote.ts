import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { PollAnswer } from '../../../models/poll-answer.model';
import { PollVote } from '../../../models/poll-vote.model';
import { Vars } from '../../../vars';

export async function updatePollVote(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const pollAnswerId = req.params.pollAnswerId;
        const incomingData = req.body;

        const pollAnswerData: PollAnswer | null = await PollAnswer.scope('includePoll').findByPk(req.params.id)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error!' }));
        }
        if (pollAnswerData === null) {
            return res.status(400).send(wrapResponse(false, { error: 'There is no active PollAnswer with the given id!' }));
        }
        if (pollAnswerData.poll.org_id !== Vars.currentOrganization.id) {
            return res.status(403).send(wrapResponse(false, { error: 'Forbidden!' }));
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
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (pollVoteData === null) {
            return res.status(400).send(wrapResponse(false, { error: 'No PollVote with given id found' }));
        }

        if (!checkKeysAreNotEmptyOrNotSet(incomingData, [ 'body' ])) {
            return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));
        }

        pollVoteData.update(incomingData.title)
            .catch(() => {
                success = false;
                return [ 0, [] ];
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (pollVoteData === null) {
            return res.send(wrapResponse(true, { info: 'Nothing updated' }));
        }

        return res.send(wrapResponse(true, pollVoteData));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}