export interface ItemDataSnapshot{
    id: string;
    title: string;
    description: string;
    price: number;
}

export interface ItemData extends ItemDataSnapshot{
    organization: unknown;
}