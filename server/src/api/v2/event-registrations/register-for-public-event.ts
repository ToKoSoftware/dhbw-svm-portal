import { NextFunction, Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Event } from '../../../models/event.model';
import { User } from '../../../models/user.model';
import { EventRegistration } from '../../../models/event-registration.model';
import { loadDecodedTokenFromHeader } from '../../../functions/load-decoded-token-from-header.func';
import { CustomError } from '../../../middleware/error-handler';
import { PortalErrors } from '../../../enum/errors';

export async function registerForPublicEvents(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const orgId = req.params.id;
        const eventId = req.params.eventId;
        const currentDate = new Date();
        // Only events, that have an end_date in the future, that are active and marked as public.
        const eventData: Event | null = await Event.scope(
            [
                { method: [ 'onlyCurrentOrg', orgId ] },
                'public',
                { method: [ 'notExpired', currentDate ] }
            ]
        )
            .findByPk(eventId)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (eventData === null) {
            return res.status(400).send(wrapResponse(false, { error: 'No public Event with given id found!' }));
        }

        const [ decodingSuccessful, userDataFromToken ] = loadDecodedTokenFromHeader(req);
        let userData: User | null = null;
        if (decodingSuccessful && userDataFromToken !== null && typeof userDataFromToken !== 'string') {
            userData = await User.scope('full').findByPk(userDataFromToken.id);
            if (userData === null) {
                res.status(401).send(wrapResponse(false, { error: 'Unauthorized!' }));
            }
        } else {
            res.status(401).send(wrapResponse(false, { error: 'Unauthorized!' }));
        }

        const createdData = await EventRegistration.scope('full').findOrCreate({
            where: {
                user_id: userData?.id,
                event_id: eventData.id,
                payment_done: false,
                body: req.body.body
            }
        })
            .catch(() => {
                success = false;
                return [ null, false ];
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }

        return res.send(wrapResponse(true, createdData[ 0 ]));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}