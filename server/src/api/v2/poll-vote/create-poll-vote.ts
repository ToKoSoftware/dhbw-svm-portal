import { Request, Response } from 'express';
import { mapPollVote } from '../../../functions/map-poll-vote.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { PollVote } from '../../../models/poll-vote.model';

export async function voteForPollAnswer(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData = req.body;
    const incomingParams = req.params;
    const mappedIncomingData = mapPollVote(incomingData, incomingParams.pollAnswerId);

    //TODO: Checken ob pollId und pollAnswerId existiert.

    const createdData = await PollVote.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not create PollVote' }));
    }

    return res.send(wrapResponse(true, createdData));
}