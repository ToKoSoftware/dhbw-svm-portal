import { Request, Response } from 'express';
import { mapOrder } from '../../../functions/map-order.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawOrderData } from '../../../interfaces/order.interface';
import { Item } from '../../../models/item.model';
import { Order } from '../../../models/order.model';

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