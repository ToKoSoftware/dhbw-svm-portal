import { NextFunction, Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Role } from '../../../models/role.model';
import { RoleAssignment } from '../../../models/role-assignment.model';
import { PortalErrors } from '../../../enum/errors';
import { CustomError } from '../../../middleware/error-handler';


export async function deleteRole(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
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
            return res.status(500).send(wrapResponse(false, { error: 'Could not delete role with id ' + req.params.id }));
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
            return res.status(500).send(wrapResponse(false, { error: 'Could not delete role with id ' + req.params.id }));
        }

        return res.status(204).send(wrapResponse(true));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }

}