import { Membership } from '../models/membership.model';
import { Organization } from '../models/organization.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

export interface TeamDataSnaphot {
    id?: string;
    title: string;
    is_active?: boolean;
}

export interface RawTeamData extends TeamDataSnaphot {
    org_id: string;
    maintain_role_id: string;
}

export interface TeamData extends TeamDataSnaphot {
    organization: Organization;
    maintain_role: Role;
    users: Array<User & { membership: Membership }>;

}