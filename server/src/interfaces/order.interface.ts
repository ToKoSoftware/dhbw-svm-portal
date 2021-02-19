import { Item } from '../models/item.model';
import { User } from '../models/user.model';

export interface OrderDataSnapshot{
    id?: string;
    amount: number;
    value: number;
    payment_done: boolean;
    delivered: boolean;
}

export interface RawOrderData extends OrderDataSnapshot{
    user_id: string;
    item_id: string;
}

export interface OrderData extends OrderDataSnapshot{
    user: User;
    item: Item;
}