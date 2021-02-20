import { NextFunction, Request, Response } from 'express';
import { User } from '../../../models/user.model';
import { wrapResponse } from '../../../functions/response-wrapper';
import { FindOptions } from 'sequelize';
import { buildQuery, QueryBuilderConfig } from '../../../functions/query-builder.func';
import { currentUserIsAdminOrMatchesId } from '../../../functions/current-user-is-admin-or-matches-id.func';
import { Vars } from '../../../vars';
import { CustomError } from '../../../middleware/error-handler';
import { PortalErrors } from '../../../enum/errors';

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        if (!currentUserIsAdminOrMatchesId(req.params.id)) {
            return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
        }
        const data = await User
            .scope(Vars.currentUserIsAdmin
                ? [ 'full', { method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] } ]
                : Vars.currentUser.id === req.params.id
                    ? [ 'full' ]
                    : [ { method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }, 'publicData' ]
            )
            .findByPk(req.params.id)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (data === null) {
            return res.status(404).send(wrapResponse(false));
        }
        return res.send(wrapResponse(data != null, data));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}

export async function getUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let query: FindOptions = {};
        const allowedSearchFilterAndOrderFields = [ 'email' ];
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
        const data = await User.scope(
            Vars.currentUserIsAdmin
                ? [ 'full', { method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] } ]
                : [ { method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }, 'publicData' ]
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
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}
