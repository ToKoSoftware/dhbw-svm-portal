import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Order } from '../../../models/order.model';
import { User } from '../../../models/user.model';
import { Vars } from '../../../vars';

export async function getOrder(req: Request, res: Response): Promise<Response> {
    let success = true;

    const orderData: Order | null = await Order
        .scope(
            Vars.currentUserIsAdmin
                ? ['full', 'ordered']
                : [{ method: ['onlyOwnOrder', Vars.currentUser.id] }, 'ordered']
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
    if (Vars.currentUserIsAdmin) {
        if (orderData.user.org_id !== Vars.currentOrganization.id) {
            return res.status(403).send(wrapResponse(false, 'Permission denied!'));
        }
    }
    
    return res.send(wrapResponse(true, orderData));
}

export async function getOrders(req: Request, res: Response): Promise<Response> {
    let success = true;
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

    const orderData: Order[] = await Order
        .scope(
            Vars.currentUserIsAdmin
                ? ['full', 'ordered']
                : [{ method: ['onlyOwnOrder', Vars.currentUser.id] }, 'ordered']
        )
        .findAll({
            where: {
                user_id: userIds
            }
        })
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