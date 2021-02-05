import { Request, Response } from 'express';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawRoleData } from '../../../interfaces/role.interface';
import { Role } from '../../../models/role.model';

export async function updateRole(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawRoleData = req.body;
    const roleId = req.params.id;

    const roleData: Role | null = await Role.findOne(
        {
            where: {
                id: roleId
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (roleData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Role with given id found' }));
    }

    // Org_id must not be changed
    if (incomingData.org_id !== roleData.org_id) {
        if (incomingData.org_id !== undefined) {
            return res.status(400).send(wrapResponse(false, { error: 'Org_id must not be changed!' }));
        }
    }

    const requiredFields = Role.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty'}));
    }
    
    roleData.update(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (roleData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, roleData));
}