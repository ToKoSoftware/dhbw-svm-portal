import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { Organization } from '../../../models/organization.model';
import { Vars } from '../../../vars';

export async function deleteOrganization(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
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
            return res.status(400).send(wrapResponse(false, {
                error: 'Organizations with more than one existing user must not be deleted'
            }));
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
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}