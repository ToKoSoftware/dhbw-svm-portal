import {Request, Response} from 'express';
import {Sequelize} from 'sequelize-typescript';
import {wrapResponse} from '../../../functions/response-wrapper';
import User from '../../../models/user.model';

export async function getMonthlyStats(req: Request, res: Response): Promise<Response>  {
    const userCount = await countMonthlyEntities(User);

    const data = {
        'users': userCount,
    };
    return res.send(wrapResponse(true, data));
}

async function countMonthlyEntities(model: typeof User) {
    const count = await model.count(
        {
            group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))]
        })
        .catch(() => 0);

    return count;
}

