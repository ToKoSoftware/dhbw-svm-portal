import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { User } from '../../../models/user.model';
import { Vars } from '../../../vars';

export async function getStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const usersCount = await countTotalEntities(User);
        const data = {
            'users': usersCount
        };
        return res.send(wrapResponse(true, data));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}

async function countTotalEntities(model: typeof User, is_active = true): Promise<number | void> {
    try {
        return await model.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).count({
            where: {
                is_active: is_active
            }
        }).catch(() => 0);
    } catch (error) {
        throw new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error);
    }
}
