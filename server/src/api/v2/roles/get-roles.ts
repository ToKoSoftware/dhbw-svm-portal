import { Request, Response } from 'express';
import { FindOptions } from 'sequelize';
import { buildQuery, QueryBuilderConfig } from '../../../functions/query-builder.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { News } from '../../../models/news.model';
import { Vars } from '../../../vars';
import { RoleData } from '../../../interfaces/role.interface';
import { User } from '../../../models/user.model';
import { Organization } from '../../../models/organization.model';
import { Team } from '../../../models/team.model';
import { Role } from '../../../models/role.model';


export async function getRole(req: Request, res: Response): Promise<Response> {
    let success = true;


    const roleData: RoleData | null = await Role
        .scope({method: ['onlyCurrentOrg', Vars.currentOrganization.id]})
        .findOne({
            where: {
                id: req.params.id   
            },
            ... Vars.currentUser.is_admin ? {
                include: [{model: Organization, as: 'organization'},{model: Organization, as: 'admin_of_organization'}, Team, User]
            } : {
                include: {
                    model: User.scope('publicData')
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
    if (roleData === null) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(true, roleData));
}

export async function getRoles(req: Request, res: Response): Promise<Response> {
    let query: FindOptions = {};
    const allowedSearchFilterAndOrderFields = ['title'];
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
    const data = await Role.scope(['full', {method: ['onlyCurrentOrg', Vars.currentOrganization.id]}]).findAll(query)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, data));
}
