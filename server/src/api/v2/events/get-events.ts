import { Request, Response } from 'express';
import { FindOptions} from 'sequelize';
import { buildQuery, QueryBuilderConfig } from '../../../functions/query-builder.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Event } from '../../../models/event.model';
import { Vars } from '../../../vars';
import { EventData } from '../../../interfaces/event.interface';
import { User } from '../../../models/user.model';
import { Organization } from '../../../models/organization.model';


export async function getEvent(req: Request, res: Response): Promise<Response> {
    let success = true;


    const eventData: EventData | null = await Event
        .scope({method: ['onlyCurrentOrg', Vars.currentOrganization.id]})
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
        .catch(() => {
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
    let query: FindOptions = {};
    const allowedSearchFilterAndOrderFields = ['title','date'];
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: req.query.search as string || '',
        allowLimitAndOffset: true,
        allowedFilterFields: allowedSearchFilterAndOrderFields,
        allowedSearchFields: allowedSearchFilterAndOrderFields,
        allowedOrderFields: allowedSearchFilterAndOrderFields
    };
    query = buildQuery(queryConfig, req);

    let success = true;
    const currentDate = new Date();
    // Only events, that have an end_date in the future, that are active. Ordered by start_date ASC
    const data = await Event.scope(['full', {method: ['onlyCurrentOrg', Vars.currentOrganization.id]}, 'active', {method: ['notExpired', currentDate]}, 'ordered']).findAll(query)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, data));
}
