import { Request, Response } from 'express';
import { mapOrder } from '../../../functions/map-order.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawOrderData } from '../../../interfaces/order.interface';
import { Item } from '../../../models/item.model';
import { Order } from '../../../models/order.model';
import { Vars } from '../../../vars';

export async function createOrder(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawOrderData = req.body;
    const item: Item | null = await Item.findByPk(incomingData.item_id);
    if (!item) {
        return res.status(400).send(wrapResponse(false, 'Invalid item_id!'));
    }
    const mappedIncomingData: RawOrderData = mapOrder(incomingData, item);

    const order: Order | null = await Order.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, order));
}

export async function createSingleOrder(req: Request, res: Response): Promise<Response> {
    let success = true;
    const item: Item | null = await Item.findByPk(req.params.id);
    if (!item) {
        return res.status(400).send(wrapResponse(false, 'Invalid item_id!'));
    }

    const order: Order | null = await Order.create(
        {
            user_id: Vars.currentUser.id,
            item_id: item.id,
            delivered: false,
            payment_done: false,
            amount: 1,
            value: item.price
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, order));
}