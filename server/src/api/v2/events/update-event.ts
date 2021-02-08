import { Request, Response } from 'express';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawEventData } from '../../../interfaces/event.interface';
import { Event } from '../../../models/event.model';

export async function updateEvent(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawEventData = req.body;
    const eventId = req.params.id;

    const eventData: Event | null = await Event.findByPk(eventId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (eventData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Event with given id found' }));
    }
    // Author_id and org_id and id must not be changed
    delete incomingData.author_id;
    delete incomingData.org_id;
    delete incomingData.id;

    const requiredFields = Event.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));
    }

    eventData.update(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (eventData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, eventData));
}