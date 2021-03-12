import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Order } from '../../../models/order.model';
import { Vars } from '../../../vars';

export async function getOrder(req: Request, res: Response): Promise<Response> {
    let success = true;

    const orderData: Order | null = await Order
        .scope(
            Vars.currentUserIsAdmin
                ? [{ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }, 'full', 'ordered']
                : [{ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }, 
                    { method: ['onlyOwnOrder', Vars.currentUser.id] }, 
                    'ordered']
        )
        .findByPk(req.params.id)
        .catch(() => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (orderData === null) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(true, orderData));
}

export async function getOrders(req: Request, res: Response): Promise<Response> {
    let success = true;

    const orderData: Order[] = await Order
        .scope(
            Vars.currentUserIsAdmin
                ? [{ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }, 'full', 'ordered']
                : [{ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }, 
                    { method: ['onlyOwnOrder', Vars.currentUser.id] }, 
                    'ordered']
        )
        .findAll()
        .catch(() => {
            success = false;
            return [];
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (orderData === []) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(true, orderData));
}