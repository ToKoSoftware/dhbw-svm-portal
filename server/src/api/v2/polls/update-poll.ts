import { Request, Response } from 'express';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawPollData } from '../../../interfaces/poll.interface';
import { Poll } from '../../../models/poll.model';

export async function updatePoll(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawPollData = req.body;
    const pollId = req.params.id;

    const pollData: Poll | null = await Poll.findByPk(pollId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Poll with given id found' }));
    }

    // Author_id and org_id must not be changed
    if (incomingData.author_id !== pollData.author_id || incomingData.org_id !== pollData.org_id) {
        if (incomingData.author_id !== undefined || incomingData.org_id !== undefined) {
            return res.status(400).send(wrapResponse(false, { error: 'Author_id and org_id must not be changed!' }));
        }
    }

    const requiredFields = Poll.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));
    }

    pollData.update(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, pollData));
}