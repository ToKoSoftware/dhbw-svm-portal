import { NextFunction, Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RoleAssignment } from '../../../models/role-assignment.model';
import { RawRoleAssignmentData } from '../../../interfaces/role-assignment.interface';
import { mapRoleAssignment } from '../../../functions/map-role-assignment.func';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { PortalErrors } from '../../../enum/errors';
import { CustomError } from '../../../middleware/error-handler';

export async function deleteRoleAssignment(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const incomingData: RawRoleAssignmentData = req.body;
    const mappedIncomingData: RawRoleAssignmentData = mapRoleAssignment(incomingData, req.params.id);
    const requiredFields = RoleAssignment.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        next(new CustomError(PortalErrors.NOT_ALL_REQUIRED_FIELDS_HAVE_BEEN_SET, 400));
    }
    // todo current org
    // todo check if admin org and count users (min 1)
    await RoleAssignment.destroy(
        {
            where: {
                user_id: mappedIncomingData.user_id,
                role_id: mappedIncomingData.role_id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    return res.status(204).send(wrapResponse(true));
}
