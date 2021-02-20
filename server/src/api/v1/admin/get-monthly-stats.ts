import { NextFunction, Request, Response } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { PortalErrors } from '../../../enum/errors';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { User } from '../../../models/user.model';
import { Vars } from '../../../vars';

export async function getMonthlyStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const userCount = await countMonthlyEntities(User);
        const data = {
            'users': userCount,
        };
        return res.send(wrapResponse(true, data));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}

async function countMonthlyEntities(model: typeof User) {
    try {
        const count = await model.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).count(
            {
                group: [ Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')) ]
            })
            .catch(() => 0);

        return count;
    } catch (error) {
        throw new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error);
    }
}

