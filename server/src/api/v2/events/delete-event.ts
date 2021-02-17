import { Request, Response } from 'express';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Event } from '../../../models/event.model';
import { Vars } from '../../../vars';

export async function deleteEvent(req: Request, res: Response): Promise<Response> {
    let success = true;

    const event: Event | null = await Event.scope({ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }).findByPk(req.params.id)
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

    const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
    if (
        !maintainedTeamIds.find(id => id == event.allowed_team_id)
        && !Vars.currentUserIsAdmin
        && event.allowed_team_id !== 'public'
        && !maintainedTeamIds.length
    ) {
        return res.status(403).send(wrapResponse(false, { error: 'You are not allowed to delete an Event for a team you are not maintainer of.' }));
    }

    event.update(
        {
            is_active: false,
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not deactivate Event with id ' + req.params.id }));
    }

    return res.status(204).send(wrapResponse(true));
}