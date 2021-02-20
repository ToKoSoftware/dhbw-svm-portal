import { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Team } from '../../../models/team.model';
import { Vars } from '../../../vars';
import { User } from '../../../models/user.model';
import { Organization } from '../../../models/organization.model';
import { Role } from '../../../models/role.model';
import { PortalErrors } from '../../../enum/errors';
import { CustomError } from '../../../middleware/error-handler';

export async function getTeam(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        let query;

        if (Vars.currentUserIsAdmin) {
            query = {
                where: {
                    id: req.params.id
                },
                include: [ { model: Organization, as: 'organization' }, Role, User ]
            };
        } else {
            const roleIds = Vars.currentUser.assigned_roles.map(r => r.id);
            const teamIds = Vars.currentUser.teams.map(t => t.id);
            query = {
                where: {
                    [ Op.and ]: [
                        { id: req.params.id },
                        {
                            [ Op.or ]: [
                                { id: teamIds },
                                { maintain_role_id: roleIds }
                            ]
                        }
                    ]
                },
                include: {
                    model: User.scope('publicData')
                }
            };
        }


        const teamData: Team | null = await Team.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] })
            .findOne(query)
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
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}

export async function getTeams(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        if (!Vars.currentUserIsAdmin && Vars.currentUser.teams.length === 0) {
            return res.send(wrapResponse(true, []));
        }
        const query = Vars.currentUserIsAdmin
            ? {}
            : {
                where: {
                    id: Vars.currentUser.teams.map(t => t.id)
                }
            };

        const data = await Team.scope([ 'full', { method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }, 'ordered' ]).findAll(query)
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
