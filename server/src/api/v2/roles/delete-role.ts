import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {User} from '../../../models/user.model';
import {Role} from '../../../models/role.model';
import { RoleAssignment } from '../../../models/role-assignment.model';
import { RoleData } from '../../../interfaces/role.interface';

export async function deleteRole(req: Request, res: Response): Promise<Response> {
    let success = true;
    await Role.update(
        {
            is_active: false,
        },
        {
            where: {
                id: req.params.id,
                is_active: true
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not deactivate role with id ' + req.params.id}));
    }

    // if  Users are assigned, you can only set roles to inactive with information about assignments
    const count: number = await RoleAssignment.count(
        {
            where: {
                role_id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return 0;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    //finding the assigned users of the role which is to delete
    const assignments: RoleData | null = await Role
        .findOne(
            {
                where: {
                    id: req.params.id,
                    is_active: false
                },
                include: {model: User.scope('publicData')}
            })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    
    if (count > 0 && assignments !== null ) {
        return res.send(wrapResponse(true, 
            {
                message: 'Role sucessful deactivated. The following persons should be informed',
                data: assignments.users
            }
        ));
    }

    return res.status(204).send(wrapResponse(true));
    
    
}