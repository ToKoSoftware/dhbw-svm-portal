import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawRoleData } from '../../../interfaces/role.interface';
import { CustomError } from '../../../middleware/error-handler';
import { Role } from '../../../models/role.model';

export async function updateRole(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const incomingData: RawRoleData = req.body;
    const roleId = req.params.id;

    const roleData: Role | null = await Role.findByPk(roleId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (roleData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Role with given id found' }));
        //next(new CustomError(PortalErrors.NO_ROLE_WITH_GIVEN_ID_FOUND, 400));
    }

    // Org_id must not be changed
    delete incomingData.org_id;
    delete incomingData.id;

    const requiredFields = Role.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        next(new CustomError(PortalErrors.FIELDS_MUST_NOT_BE_EMPTY, 400));
    }

    roleData.update(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (roleData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, roleData));
}