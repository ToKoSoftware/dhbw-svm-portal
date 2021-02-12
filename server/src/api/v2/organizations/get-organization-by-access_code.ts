import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Vars } from '../../../vars';
import { User } from '../../../models/user.model';
import { Organization } from '../../../models/organization.model';

export async function getOrganizationByAccessCode(req: Request, res: Response): Promise<Response> {
    let success = true;
    const organizationData: Organization | null = await Organization
        .scope([Vars.currentUserIsAdmin ? 'full' : 'active']) //  todo permission check in #98
        .findOne({
            where: {
                access_code: req.params.code
            }, 
            ...!Vars.currentUserIsAdmin ? {
                include: {
                    model: User.scope('publicData')
                }
            }: {}
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
}

