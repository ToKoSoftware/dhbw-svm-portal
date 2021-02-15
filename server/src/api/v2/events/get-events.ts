import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Event } from '../../../models/event.model';
import { Vars } from '../../../vars';
import { EventData } from '../../../interfaces/event.interface';
import { User } from '../../../models/user.model';
import { Organization } from '../../../models/organization.model';


export async function getEvent(req: Request, res: Response): Promise<Response> {
    let success = true;


    const eventData: EventData | null = await Event
        .scope(
            Vars.currentUserIsAdmin 
                ? [{method: ['onlyCurrentOrg', Vars.currentOrganization.id]}]
                : [{method: ['onlyCurrentOrg', Vars.currentOrganization.id]},{method: ['onlyAllowedTeam', Vars.currentUser.teams.map(t => t.id), Vars.currentOrganization.public_team_id]}]
        )
        .findOne({
            where: {
                id: req.params.id   
            },
            ... Vars.currentUserIsAdmin ? {
                include: [Organization, {model: User, as: 'author'}, {model: User, as: 'registered_users'}]
            } : {
                include: {
                    model: User.scope('publicData'), as: 'author'
                } 
            }
        })
        .catch((error) => {
            Vars.loggy.log(error);
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (eventData === null) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(true, eventData));
}

export async function getEvents(req: Request, res: Response): Promise<Response> {
    let success = true;
    const currentDate = new Date();
    // Only events, that have an end_date in the future, that are active. Ordered by start_date ASC
    const data = await Event.scope(
        Vars.currentUserIsAdmin
            ? [{method: ['onlyCurrentOrg', Vars.currentOrganization.id]}, 'ordered', 'full']
            : [
                'full', 
                {method: ['onlyCurrentOrg', Vars.currentOrganization.id]}, 
                {method: ['onlyAllowedTeam', Vars.currentUser.teams.map(t => t.id), Vars.currentOrganization.public_team_id]},
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
