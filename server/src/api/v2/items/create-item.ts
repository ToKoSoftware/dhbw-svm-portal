import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawItemData } from '../../../interfaces/item.interface';
import { Item } from '../../../models/item.model';

export async function createItem(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawItemData = req.body;

    const item: Item | null = await Item.create(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, item));
}