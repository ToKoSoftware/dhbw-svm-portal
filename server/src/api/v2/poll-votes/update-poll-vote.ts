import { Request, Response } from 'express';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { PollVote } from '../../../models/poll-vote.model';
import { Vars } from '../../../vars';

export async function updatePollVote(req: Request, res: Response): Promise<Response> {
    let success = true;
    const pollAnswerId = req.params.pollAnswerId;
    const incomingData = req.body;

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

    if (!checkKeysAreNotEmptyOrNotSet(incomingData, ['body'])) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));
    }

    pollVoteData.update(incomingData)
        .catch(() => {
            success = false;
            return [0, []];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollVoteData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, pollVoteData));
}