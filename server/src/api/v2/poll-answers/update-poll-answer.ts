import { Request, Response } from 'express';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawPollAnswerData } from '../../../interfaces/poll-answer.interface';
import { PollAnswer } from '../../../models/poll-answer.model';

export async function updatePollAnswer(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawPollAnswerData = req.body;
    const pollAnswerId = req.params.id;

    const pollAnswerData: RawPollAnswerData | null = await PollAnswer.findOne(
        {
            where: {
                id: pollAnswerId
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollAnswerData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No PollAnswer with given id found' }));
    }

    const requiredFields = PollAnswer.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty'}));
    }
    
    const updatedData: [number, PollAnswer[]] = await PollAnswer.update(
        incomingData, 
        { 
            where: {
                id: pollAnswerId
            },
            returning: true
        })
        .catch(() => {
            success = false;
            return [0, []];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (updatedData[0] === 0 || updatedData[1] === []) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, updatedData[1]));
}