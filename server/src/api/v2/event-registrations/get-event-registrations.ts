import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { EventRegistration } from '../../../models/event-registration.model';
import { Event } from '../../../models/event.model';
import { User } from '../../../models/user.model';
import { Vars } from '../../../vars';

export async function getEventRegistration(req: Request, res: Response): Promise<Response> {
    let success = true;
    const eventId = req.params.event_id;
    const userId = Vars.currentUserIsAdmin ? req.body.user_id : Vars.currentUser.id;

    if (Vars.currentUserIsAdmin) {
        const user: User | null = await User.scope({ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }).findByPk(userId)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if(user === null) {
            return res.status(403).send(wrapResponse(false, { error: 'Forbidden'}));
        }
    }

    const eventRegistrationData = EventRegistration.findAll(
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
}

export async function getEventRegistrationsFromUser(req: Request, res: Response): Promise<Response> {
    let success = true;
    const userId = Vars.currentUserIsAdmin ? req.body.user_id : Vars.currentUser.id;

    if (Vars.currentUserIsAdmin) {
        const user: User | null = await User.scope({ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }).findByPk(userId)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if(user === null) {
            return res.status(403).send(wrapResponse(false, { error: 'Forbidden'}));
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
}

export async function getEventRegistrationsFromEvent(req: Request, res: Response): Promise<Response> {
    let success = true;
    const eventId = req.params.event_id;

    if (Vars.currentUserIsAdmin) {
        const event: Event | null = await Event.scope({ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }).findByPk(eventId)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if(event === null) {
            return res.status(403).send(wrapResponse(false, { error: 'Forbidden'}));
        }
    }

    const data = await EventRegistration.findAll(
        {
            where: {
                event_id: eventId
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
}