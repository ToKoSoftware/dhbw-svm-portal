import { Request, Response } from 'express';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapRoleAssignment } from '../../../functions/map-role-assignment.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawRoleAssignmentData } from '../../../interfaces/role-assignment.interface';
import { RoleAssignment } from '../../../models/role-assignment.model';
import { Role } from '../../../models/role.model';

export async function createRoleAssignmnet(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawRoleAssignmentData = req.body;
    const mappedIncomingData: RawRoleAssignmentData = mapRoleAssignment(incomingData, req.params.id);
    
    const requiredFields = RoleAssignment.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    const team = await Role.findByPk(mappedIncomingData.role_id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (team === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No Role with given id' }));
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
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, createdData));
}