import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Item } from '../../../models/item.model';

export async function deleteItem(req: Request, res: Response): Promise<Response> {
    let success = true;

    const item: Item | null = await Item
        .findByPk(req.params.id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (item === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Item with given id found!' }));
    }

    item.destroy()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not delete Item with id ' + req.params.id }));
    }

    return res.status(204).send(wrapResponse(true));
}