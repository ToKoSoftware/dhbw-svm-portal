import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Item } from '../../../models/item.model';
import { Vars } from '../../../vars';

export async function getItem(req: Request, res: Response): Promise<Response> {
    let success = true;

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

    return res.send(wrapResponse(true, itemData));
}

export async function getItems(req: Request, res: Response): Promise<Response> {
    let success = true;

    const itemData: Item[] = await Item
        .scope([{method: ['onlyCurrentOrg', Vars.currentOrganization.id]}, 'ordered'])
        .findAll()
        .catch(() => {
            success = false;
            return [];
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (itemData === []) {
        return res.status(400).send(wrapResponse(false));
    }

    return res.send(wrapResponse(true, itemData));
}