import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { EventRegistration } from '../../../models/event-registration.model';
import { Vars } from '../../../vars';

export async function getEventRegistration(req: Request, res: Response): Promise<Response> {
    let success = true;
    const eventId = req.params.event_id;
    const userId = Vars.currentUserIsAdmin ? req.body.user_id : Vars.currentUser.id;

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

export async function getEventRegistrations(req: Request, res: Response): Promise<Response> {
    let success = true;
    const userId = Vars.currentUserIsAdmin ? req.body.user_id : Vars.currentUser.id;

    //TODO Rechte
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