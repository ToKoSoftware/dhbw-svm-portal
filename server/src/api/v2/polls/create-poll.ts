import { Request, Response } from 'express';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapPoll } from '../../../functions/map-polls.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawPollData } from '../../../interfaces/poll.interface';
import { Poll } from '../../../models/poll.model';

export async function createPoll(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData = req.body;
    const mappedIncomingData: RawPollData = mapPoll(incomingData);

    const requiredFields = Poll.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    if (mappedIncomingData.closes_at.toString() === 'Invalid Date') {
        return res.status(400).send(wrapResponse(false, { error: 'Closes_at is not valid' }));
    }

    // TODO: input checker, ob team_id zu org gehört

    const createdData = await Poll.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not create Poll' }));
    }

    return res.send(wrapResponse(true, createdData));
}