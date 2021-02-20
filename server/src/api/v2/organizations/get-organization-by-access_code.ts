import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { Organization } from '../../../models/organization.model';

export async function getOrganizationByAccessCode(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const organizationData: Organization | null = await Organization
            .scope('active')
            .findOne({
                where: {
                    access_code: req.params.code
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
            return res.status(404).send(wrapResponse(false));
        }
        return res.send(wrapResponse(true, organizationData));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}

