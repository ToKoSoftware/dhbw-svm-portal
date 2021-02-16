import { Request, Response } from 'express';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapEvent } from '../../../functions/map-events.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { EventDataSnapshot, RawEventData } from '../../../interfaces/event.interface';
import { Event } from '../../../models/event.model';

export async function createEvent(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: EventDataSnapshot = req.body;
    const mappedIncomingData: RawEventData = mapEvent(incomingData);

    const requiredFields = Event.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields, true)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    if (mappedIncomingData.start_date.toString() === 'Invalid Date' || mappedIncomingData.end_date.toString() === 'Invalid Date') {
        return res.status(400).send(wrapResponse(false, { error: 'Dates are not valid' }));
    }

    if (mappedIncomingData.start_date > mappedIncomingData.end_date) {
        return res.status(400).send(wrapResponse(false, { error: 'Start_date has to be before end_date!' }));
    }

    const createdData = await Event.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not create Event' }));
    }

    return res.send(wrapResponse(true, createdData));
}
