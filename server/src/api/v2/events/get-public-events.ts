import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Event } from '../../../models/event.model';

export async function getPublicEvents(req: Request, res: Response): Promise<Response> {
    let success = true;
    const orgId = req.params.id;
    const currentDate = new Date();
    // Only events, that have an end_date in the future, that are active and marked as public. Ordered by start_date ASC
    const data = await Event.scope(
        [
            {method: ['onlyCurrentOrg', orgId]},
            'public',
            'active', 
            {method: ['notExpired', currentDate]}, 
            'ordered'
        ]
    )
        .findAll()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, data));
}