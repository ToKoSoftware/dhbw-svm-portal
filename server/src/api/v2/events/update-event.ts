import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawEventData } from '../../../interfaces/event.interface';
import { Event } from '../../../models/event.model';

export async function updateEvent(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData = req.body;
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

    return res.send(wrapResponse(true, {}));
}