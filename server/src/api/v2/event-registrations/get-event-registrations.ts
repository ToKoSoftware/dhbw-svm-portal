import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { EventRegistration } from '../../../models/event-registration.model';
import { Event } from '../../../models/event.model';
import { User } from '../../../models/user.model';
import { Vars } from '../../../vars';

export async function getEventRegistration(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const eventId = req.params.event_id;
        const userId = Vars.currentUserIsAdmin ? req.body.user_id : Vars.currentUser.id;

        const user: User | null = await User.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).findByPk(userId)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (user === null) {
            return res.status(403).send(wrapResponse(false, { error: 'Forbidden' }));
        }


        const eventRegistrationData = await EventRegistration.findAll(
            {
                where: {
                    event_id: eventId,
                    user_id: userId
                }
            })
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (eventRegistrationData === null) {
            return res.status(404).send(wrapResponse(false));
        }

        return res.send(wrapResponse(true, eventRegistrationData));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}

export async function getEventRegistrationsFromUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const userId = Vars.currentUserIsAdmin ? req.body.user_id : Vars.currentUser.id;

        if (Vars.currentUserIsAdmin) {
            const user: User | null = await User.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).findByPk(userId)
                .catch(() => {
                    success = false;
                    return null;
                });
            if (!success) {
                return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
            }
            if (user === null) {
                return res.status(403).send(wrapResponse(false, { error: 'Forbidden' }));
            }
        }
        const data = await EventRegistration.findAll(
            {
                where: {
                    user_id: userId
                }
            })
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

export async function getEventRegistrationsFromEvent(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const eventId = req.params.event_id;

        const event: Event | null = await Event.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).findByPk(eventId)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (event === null) {
            return res.status(403).send(wrapResponse(false, { error: 'Forbidden' }));
        }

        const data = await EventRegistration.findAll(
            {
                where: {
                    event_id: eventId
                },
                include: User.scope('publicData')
            })
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