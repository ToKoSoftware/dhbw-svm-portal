import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapRole } from '../../../functions/map-roles.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RoleDataSnapshot, RawRoleData } from '../../../interfaces/role.interface';
import { CustomError } from '../../../middleware/error-handler';
import { Role } from '../../../models/role.model';

export async function createRole(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const incomingData: RoleDataSnapshot = req.body;
    const mappedIncomingData: RawRoleData = mapRole(incomingData);

    const requiredFields = Role.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        next(new CustomError(PortalErrors.NOT_ALL_REQUIRED_FIELDS_HAVE_BEEN_SET, 400));
    }

    const createdData = await Role.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });

    if (!success) {
        //return res.status(500).send(wrapResponse(false, { error: 'Could not create Role' }));
        next(new CustomError(PortalErrors.COULD_NOT_CREATE_ROLE, 500));
    }

    return res.send(wrapResponse(true, createdData));
}