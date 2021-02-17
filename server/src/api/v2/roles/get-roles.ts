import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
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
            ... Vars.currentUserIsAdmin ? {
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
    let success = true;
    if (!Vars.currentUserIsAdmin && Vars.currentUser.assigned_roles.length === 0) {
        return res.send(wrapResponse(true, []));
    }
    const query = Vars.currentUserIsAdmin 
        ? {} 
        : {
            where: {
                id: Vars.currentUser.assigned_roles.map(r => r.id)
            }
        };

    const data = await Role.scope(['full', {method: ['onlyCurrentOrg', Vars.currentOrganization.id]}, 'ordered']).findAll(query)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, data));
}
