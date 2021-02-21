import { NextFunction, Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Role } from '../../../models/role.model';
import { RoleAssignment } from '../../../models/role-assignment.model';
import { CustomError } from '../../../middleware/error-handler';
import { PortalErrors } from '../../../enum/errors';


export async function deleteRole(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;

    //TODO: Transaction 
    //const t = await Vars.db.Sequelize.transaction();
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
        //return res.status(500).send(wrapResponse(false, { error: 'Could not delete role with id ' + req.params.id }));
        next(new CustomError(PortalErrors.COULD_NOT_DELETE_ROLE_WITH_ID, 500));
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
        //return res.status(500).send(wrapResponse(false, { error: 'Could not delete role with id ' + req.params.id }));
        next(new CustomError(PortalErrors.COULD_NOT_DELETE_ROLE_WITH_ID, 500));
    }

    return res.status(204).send(wrapResponse(true));

}