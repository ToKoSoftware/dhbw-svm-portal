import { Request, Response } from 'express';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawEventData } from '../../../interfaces/event.interface';
import { Event } from '../../../models/event.model';

export async function updateEvent(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawEventData = req.body;
    const eventId = req.params.id;

    const eventData: RawEventData | null = await Event.findOne(
        {
            where: {
                id: eventId
            }
        })
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

    // Author_id and org_id must not be changed
    if (incomingData.author_id !== eventData.author_id || incomingData.org_id !== eventData.org_id) {
        if (incomingData.author_id !== undefined || incomingData.org_id !== undefined) {
            return res.status(400).send(wrapResponse(false, { error: 'Author_id and org_id must not be changed!' }));
        }
    }

    const requiredFields = Event.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty'}));
    }
    
    const updatedData: [number, Event[]] = await Event.update(
        incomingData, 
        { 
            where: {
                id: eventId
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