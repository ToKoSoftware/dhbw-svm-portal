import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Role} from '../../../models/role.model';
import { RoleAssignment } from '../../../models/role-assignment.model';

export async function deleteRole(req: Request, res: Response): Promise<Response> {
    let success = true;
    await Role.destroy(
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
        return res.status(500).send(wrapResponse(false, {error: 'Could not delete role with id ' + req.params.id}));
    }

    await RoleAssignment.destroy(
        {
            where: {
                role_id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not delete role with id ' + req.params.id}));
    }

    return res.status(204).send(wrapResponse(true));
    
}