import { Request, Response } from 'express';
import { FindOptions } from 'sequelize';
import { buildQuery, QueryBuilderConfig } from '../../../functions/query-builder.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { News } from '../../../models/news.model';
import { Vars } from '../../../vars';
import { OrganizationData } from '../../../interfaces/organization.interface';
import { User } from '../../../models/user.model';
import { Organization } from '../../../models/organization.model';




export async function getOrganization(req: Request, res: Response): Promise<Response> {
    let success = true;


    const organizationData: OrganizationData | null = await Organization
        .scope([Vars.currentUser.is_admin ? 'full' : 'active']) //  todo permission check
        .findOne({
            where: {
                id: req.params.id
            }, 
            ...!Vars.currentUser.is_admin ? {
                include: {
                    model: User.scope('publicData')
                }
            }: {}
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (organizationData === null) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(true, organizationData));
}

export async function getOrganizations(req: Request, res: Response): Promise<Response> {
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
    const data = await Organization.scope(['full', {method: ['onlyCurrentOrg', Vars.currentOrganization.id]}]).findAll(query)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, data));
}
