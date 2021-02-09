import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';

export interface NewsDataSnapshot{
    id?: string;
    title: string;
    body: string;
    is_active?: boolean;
}

export interface RawNewsData extends NewsDataSnapshot{
    org_id?: string;
    author_id?: string;
}

export interface NewsData extends NewsDataSnapshot{
    organization: Organization;
    author: User;
}