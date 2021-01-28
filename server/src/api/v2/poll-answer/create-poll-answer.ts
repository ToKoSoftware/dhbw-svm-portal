import { Request, Response } from 'express';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawPollAnswerData } from '../../../interfaces/poll-answer.interface';
import { PollAnswer } from '../../../models/poll-answer.model';

export async function createPollAnswer(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawPollAnswerData = req.body;
    // No mapping necessary.
   
    const requiredFields = PollAnswer.requiredFields();

    if (!objectHasRequiredAndNotEmptyKeys(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    const createdData = await PollAnswer.create(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not create PollAnswer' }));
    }

    return res.send(wrapResponse(true, createdData));
}