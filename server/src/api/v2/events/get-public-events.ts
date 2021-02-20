import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { Event } from '../../../models/event.model';

export async function getPublicEvents(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const orgId = req.params.id;
        const currentDate = new Date();
        // Only events, that have an end_date in the future, that are active and marked as public. Ordered by start_date ASC
        const data = await Event.scope(
            [
                { method: [ 'onlyCurrentOrg', orgId ] },
                'public',
                { method: [ 'notExpired', currentDate ] },
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
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}