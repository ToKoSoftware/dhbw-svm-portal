import { Request, Response } from 'express';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawOrganizationData } from '../../../interfaces/organization.interface';
import { Organization } from '../../../models/organization.model';

export async function updateOrganization(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawOrganizationData = req.body;
    const organizationId = req.params.id;

    const organizationData: RawOrganizationData | null = await Organization.findOne(
        {
            where: {
                id: organizationId
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (organizationData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Organization with given id found' }));
    }

    const requiredFields = Organization.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty'}));
    }
    
    const updatedData: [number, Organization[]] = await Organization.update(
        incomingData, 
        { 
            where: {
                id: organizationId
            },
            returning: true
        })
        .catch(() => {
            success = false;
            return [0, []];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (updatedData[0] === 0 || updatedData[1] === []) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, updatedData[1]));
}