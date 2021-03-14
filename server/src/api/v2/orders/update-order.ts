import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawOrderData } from '../../../interfaces/order.interface';
import { Order } from '../../../models/order.model';
import { User } from '../../../models/user.model';
import { Vars } from '../../../vars';

export async function updateOrder(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawOrderData = req.body;

    const users: User[] = await User.findAll(
        {
            where: {
                org_id: Vars.currentUser.org_id
            }
        })
        .catch(() => {
            success = false;
            return [];
        });
    const userIds = users.map(el => el.id);

    const orderData: Order | null = await Order
        .scope(['full', 'ordered'])
        .findOne({
            where: {
                id: req.params.id,
                user_id: userIds
            }
        })
        .catch(() => {
            success = false;
            return null;
        });

    if (orderData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Order with given id found' }));
    }

    delete incomingData.id;

    orderData.update(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, orderData));

}