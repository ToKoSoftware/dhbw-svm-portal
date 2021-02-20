import { NextFunction, Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RoleAssignment } from '../../../models/role-assignment.model';
import { RawRoleAssignmentData } from '../../../interfaces/role-assignment.interface';
import { mapRoleAssignment } from '../../../functions/map-role-assignment.func';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { PortalErrors } from '../../../enum/errors';
import { CustomError } from '../../../middleware/error-handler';

export async function deleteRoleAssignment(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const incomingData: RawRoleAssignmentData = req.body;
        const mappedIncomingData: RawRoleAssignmentData = mapRoleAssignment(incomingData, req.params.id);
        const requiredFields = RoleAssignment.requiredFields();
        if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
            return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
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
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        return res.status(204).send(wrapResponse(true));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}
