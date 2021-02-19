import { Request, Response } from 'express';
import { mapEventRegistration } from '../../../functions/map-event-registration.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawEventRegistrationData } from '../../../interfaces/event-registration.interface';
import { EventRegistration } from '../../../models/event-registration.model';
import { Event } from '../../../models/event.model';
import { User } from '../../../models/user.model';
import { Vars } from '../../../vars';

export async function updateEventRegistration(req: Request, res: Response): Promise<Response> {
    let success = true;
    const eventId = req.params.event_id;
    const incomingData = req.body;
    const mappedIncomingData: RawEventRegistrationData =
        Vars.currentUserIsAdmin ? incomingData : mapEventRegistration(incomingData, eventId);

    if (Vars.currentUserIsAdmin) {
        const user: User | null =
            await User.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).findByPk(incomingData.user_id)
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

    const event: Event | null = await Event.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).findByPk(eventId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (event === null) {
        return res.status(403).send(wrapResponse(false, { error: 'No event with given id found!' }));
    }


    const eventRegistrationData: EventRegistration | null = await EventRegistration.findOne(
        {
            where: {
                event_id: eventId,
                user_id: mappedIncomingData.user_id
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
        return res.status(400).send(wrapResponse(false, { error: 'No event registration for given data found!' }));
    }

    eventRegistrationData.update(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, eventRegistrationData));
}