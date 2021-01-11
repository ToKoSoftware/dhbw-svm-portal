import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import {User} from '../../../models/user.model';

export async function getStats(req: Request, res: Response): Promise<Response> {
    const usersCount = await countTotalEntities(User);

    const data = {
        'users': usersCount
    };

    return res.send(wrapResponse(true, data));
}

async function countTotalEntities(model: typeof User, is_active = true): Promise<number> {
    return await model.count({
        where: {
            is_active: is_active
        }
    }).catch(() => 0);
}
