import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapRole } from '../../../functions/map-roles.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RoleDataSnapshot, RawRoleData } from '../../../interfaces/role.interface';
import { CustomError } from '../../../middleware/error-handler';
import { Role } from '../../../models/role.model';

export async function createRole(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const incomingData: RoleDataSnapshot = req.body;
        const mappedIncomingData: RawRoleData = mapRole(incomingData);

        const requiredFields = Role.requiredFields();
        if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
            return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
        }

        const createdData = await Role.create(mappedIncomingData)
            .catch(() => {
                success = false;
                return null;
            });

        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Could not create Role' }));
        }

        return res.send(wrapResponse(true, createdData));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}