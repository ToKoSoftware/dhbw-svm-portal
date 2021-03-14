export interface OrderDataSnapshot{
    id?: string;
    amount: number;
    value: number;
    payment_done: boolean;
    delivered: boolean;
}

export interface OrderData extends OrderDataSnapshot{
    user: unknown;
    item: unknown;
}