import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Organization } from '../../../models/organization.model';
import { Vars } from '../../../vars';

export async function deleteOrganization(req: Request, res: Response): Promise<Response> {
    let success = true;
    const orgData: Organization | null = await Organization.scope('full').findByPk(Vars.currentOrganization.id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (orgData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No organization with given id found!' }));
    }

    if (orgData.users.length >= 1) {
        return res.status(400).send(wrapResponse(false, { error: 'Organizations with more than one existing user must not be deleted' }));
    }

    orgData.update(
        {
            is_active: false
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, orgData));
}