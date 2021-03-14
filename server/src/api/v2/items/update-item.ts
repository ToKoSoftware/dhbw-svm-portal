import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawItemData } from '../../../interfaces/item.interface';
import { Item } from '../../../models/item.model';
import { Vars } from '../../../vars';

export async function updateItem(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawItemData = req.body;

    const itemData: Item | null = await Item
        .scope({method: ['onlyCurrentOrg', Vars.currentOrganization.id]})
        .findByPk(req.params.id)
        .catch(() => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (itemData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Item with given id found' }));
    }

    delete incomingData.id;

    itemData.update(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, itemData));

}