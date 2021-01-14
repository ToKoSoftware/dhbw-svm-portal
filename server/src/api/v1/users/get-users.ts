import {Request, Response} from 'express';
import {User} from '../../../models/user.model';
import {wrapResponse} from '../../../functions/response-wrapper';
import {FindOptions} from 'sequelize';
import {addRelations, buildQuery, QueryBuilderConfig} from '../../../functions/query-builder.func';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {Organization} from '../../../models/organization.model';
import {RoleAssignment} from '../../../models/role-assignment.model';
import {Event} from '../../../models/event.model';
import {PollAnswer} from '../../../models/poll-answer.model';
import {Team} from '../../../models/team.model';
import {Role} from '../../../models/role.model';
import {News} from '../../../models/news.model';
import {Poll} from '../../../models/poll.model';

export async function getUser(req: Request, res: Response): Promise<Response> {
    let success = true;

    if (!currentUserIsAdminOrMatchesId(req.params.id)) {
        return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
    }

    //return everything beside password
    const data = await User.findOne(
        {
            attributes: {exclude: ['password']},
            where: {
                id: req.params.id
            },
            include: [Organization, {model: Event, as: 'registered_events'}, {model: Event, as: 'created_events'}, PollAnswer, Team, Role, News, Poll]
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (data === null) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(data != null, data));
}

export async function getUsers(req: Request, res: Response): Promise<Response> {
    let query: FindOptions = {
        include: [Team, Role, News]
    };
    const allowedSearchFilterAndOrderFields = ['email'];
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: req.query.search as string || '',
        allowLimitAndOffset: true,
        allowedFilterFields: allowedSearchFilterAndOrderFields,
        allowedSearchFields: allowedSearchFilterAndOrderFields,
        allowedOrderFields: allowedSearchFilterAndOrderFields
    };
    query = buildQuery(queryConfig, req);
    // hide password from api calls
    query.attributes = {
        exclude: ['password']
    };

    let success = true;
    const data = await User.findAll(query)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    return res.send(wrapResponse(true, data));
}
