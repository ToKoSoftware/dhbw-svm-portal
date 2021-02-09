import { Membership } from '../models/membership.model';
import { Organization } from '../models/organization.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

export interface TeamDataSnapshot {
    id?: string;
    title: string;
}

export interface RawTeamData extends TeamDataSnapshot {
    org_id?: string;
    maintain_role_id: string;
}

export interface TeamData extends TeamDataSnapshot {
    organization: Organization;
    maintain_role: Role;
    users: Array<User & { membership: Membership }>;

}