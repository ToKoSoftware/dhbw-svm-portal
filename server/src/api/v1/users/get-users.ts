import {Request, Response} from 'express';
import {User} from '../../../models/user.model';
import {wrapResponse} from '../../../functions/response-wrapper';
import {FindOptions} from 'sequelize';
import {buildQuery, QueryBuilderConfig} from '../../../functions/query-builder.func';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import { Vars } from '../../../vars';

export async function getUser(req: Request, res: Response): Promise<Response> {
    let success = true;

    if (!currentUserIsAdminOrMatchesId(req.params.id)) {
        return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
    }

    const data = await User.scope(['full', {method: ['onlyCurrentOrg', Vars.currentOrganization.id]}]).findOne(
        {
            where: {
                id: req.params.id
            }
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
    let query: FindOptions = {};
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

    let success = true;
    const data = await User.scope(['full', {method: ['onlyCurrentOrg', Vars.currentOrganization.id]}]).findAll(query)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    return res.send(wrapResponse(true, data));
}
