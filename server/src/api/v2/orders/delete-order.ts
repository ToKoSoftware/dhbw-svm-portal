import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Order } from '../../../models/order.model';
import { User } from '../../../models/user.model';
import { Vars } from '../../../vars';

export async function deleteOrder(req: Request, res: Response): Promise<Response> {
    let success = true;
    let userIds: string[] = [];
    if (Vars.currentUserIsAdmin) {
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
        userIds = users.map(el => el.id);
    }

    const order: Order | null = await Order
        .findOne({
            where: {
                id: req.params.id,
                user_id: Vars.currentUserIsAdmin ? userIds : Vars.currentUser.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (order === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Order with given id found!' }));
    }

    order.destroy()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not delete Order with id ' + req.params.id }));
    }

    return res.status(204).send(wrapResponse(true));
}