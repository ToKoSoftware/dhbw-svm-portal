import { Request, Response } from 'express';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapEventRegistration } from '../../../functions/map-event-registration.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { EventRegistrationDataSnapshot, RawEventRegistrationData } from '../../../interfaces/event-registration.interface';
import { EventRegistration } from '../../../models/event-registration.model';
import { Event } from '../../../models/event.model';
import { Vars } from '../../../vars';

export async function registerForEvent(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: EventRegistrationDataSnapshot = req.body;
    const mappedIncomingData: RawEventRegistrationData = mapEventRegistration(incomingData, req.params.id);

    const requiredFields = EventRegistration.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    const event: null | { rows: Event[], count: number } = await Event.scope(
        [
            'full', 
            { method: ['onlyCurrentOrg', Vars.currentOrganization.id] },
            {method: ['onlyAllowedTeam', Vars.currentUser.teams.map(t => t.id), Vars.currentOrganization.public_team_id]}
        ]
    ).findAndCountAll(
        {
            where: {
                id: mappedIncomingData.event_id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (event === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Event with given id found!' }));
    }
    if (event.rows[0].max_participants !== null && event.count >= event.rows[0].max_participants){
        return res.status(400).send(wrapResponse(false, { error: 'The participation limit has been reached!' }));
    }

    // Check if user is already registered for event
    const eventRegistrationCount = await EventRegistration.count(
        {
            where: {
                user_id: mappedIncomingData.user_id,
                event_id: mappedIncomingData.event_id
            }
        })
        .catch(() => {
            success = false;
            return 0;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (eventRegistrationCount !== 0) {
        return res.status(400).send(wrapResponse(false, { error: 'You already registered for this event' }));
    }


    const createdData = await EventRegistration.scope('full').create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, createdData));
}