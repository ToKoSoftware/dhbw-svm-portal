import { Organization } from '../models/organization.model';

export interface ItemDataSnapshot{
    id?: string;
    title: string;
    description: string;
    price: number;
    stock: number;
}

export interface RawItemData extends ItemDataSnapshot{
    org_id: string;
}

export interface ItemData extends ItemDataSnapshot{
    organization: Organization;
}