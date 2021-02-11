import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Team } from '../../../models/team.model';
import { Vars } from '../../../vars';
import { User } from '../../../models/user.model';
import { Organization } from '../../../models/organization.model';
import { Role } from '../../../models/role.model';

export async function getTeam(req: Request, res: Response): Promise<Response> {
    let success = true;
    let query;

    // TODO: prüfen nach maintain_role_id. Wenn User in der Rolle, dann darf auch diese sehen

    if (Vars.currentUserIsAdmin) {
        query = {
            where: {
                id: req.params.id
            },
            include: [Organization, Role, User]
        };
    } else {
        query = {
            where: {
                [Op.and]: [
                    { id: req.params.id },
                    { id: Vars.currentUser.teams.map(t => t.id) }
                ]
            },
            include: {
                model: User.scope('publicData')
            }
        };
    }

    const teamData: Team | null = await Team.scope({ method: ['onlyCurrentOrg', Vars.currentOrganization.id] })
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
}

export async function getTeams(req: Request, res: Response): Promise<Response> {
    let success = true;
    const data = await Team.scope(['full', { method: ['onlyCurrentOrg', Vars.currentOrganization.id] }, 'ordered']).findAll()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, data));
}
