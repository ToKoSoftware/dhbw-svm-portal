export interface OrderDataSnapshot{
    id?: string;
    amount: number;
    value: number;
    payment_done: boolean;
    delivered: boolean;
}

export interface OrderData extends OrderDataSnapshot{
    user: UserData;
    item: ItemData;
}
