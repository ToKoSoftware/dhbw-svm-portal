import { Request, Response } from 'express';
import { FindOptions, Op } from 'sequelize';
import { buildQuery, QueryBuilderConfig } from '../../../functions/query-builder.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Team } from '../../../models/team.model';
import { Vars } from '../../../vars';
import { TeamData } from '../../../interfaces/team.interface';
import { User } from '../../../models/user.model';
import { Organization } from '../../../models/organization.model';
import { Role } from '../../../models/role.model';

export async function getTeam(req: Request, res: Response): Promise<Response> {
    let success = true;


    const teamData: TeamData | null = await Team
        .scope({method: ['onlyCurrentOrg', Vars.currentOrganization.id]})
        .findOne({
            where: {
                ... Vars.currentUser.is_admin ? { id: req.params.id } : {
                    [Op.and]: [
                        { id: req.params.id },
                        { id: Vars.currentUser.teams.map(t => t.id)}
                    ]
                }
            },
            ... Vars.currentUser.is_admin ? {
                include: [Organization, Role, User]
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
    if (teamData === null) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(true, teamData));
}

export async function getTeams(req: Request, res: Response): Promise<Response> {
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
    const data = await Team.scope(['full', {method: ['onlyCurrentOrg', Vars.currentOrganization.id]}]).findAll(query)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, data));
}
