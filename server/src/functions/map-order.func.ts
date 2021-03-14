import { RawOrderData } from '../interfaces/order.interface';
import { Item } from '../models/item.model';
import { Vars } from '../vars';

export function mapOrder(incomingData: RawOrderData, item: Item): RawOrderData {
    return {
        item_id: item.id,
        amount: incomingData.amount,
        value: incomingData.amount * item.price,
        user_id: Vars.currentUser.id,
        payment_done: false,
        delivered: false
    };
}