import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapRoleAssignment } from '../../../functions/map-role-assignment.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawRoleAssignmentData } from '../../../interfaces/role-assignment.interface';
import { CustomError } from '../../../middleware/error-handler';
import { RoleAssignment } from '../../../models/role-assignment.model';
import { Role } from '../../../models/role.model';

export async function createRoleAssignment(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const incomingData: RawRoleAssignmentData = req.body;
    const mappedIncomingData: RawRoleAssignmentData = mapRoleAssignment(incomingData, req.params.id);

    const requiredFields = RoleAssignment.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        next(new CustomError(PortalErrors.NOT_ALL_REQUIRED_FIELDS_HAVE_BEEN_SET, 400));
    }

    const team = await Role.findByPk(mappedIncomingData.role_id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (team === null) {
        next(new CustomError(PortalErrors.NO_ROLE_WITH_GIVEN_ID, 404));
    }

    // Check if user is already registered to role. If not, create entry.
    const createdData = await RoleAssignment.scope('full').findOrCreate(
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

    return res.send(wrapResponse(true, createdData));
}
