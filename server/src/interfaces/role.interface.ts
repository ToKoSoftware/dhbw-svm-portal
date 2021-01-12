import { Organization } from '../models/organization.model';
import { Team } from '../models/team.model';

export interface RoleDataSnapshot{
    id?: string;
    title: string;
    user_deletable: boolean
    is_active?: boolean;
}

export interface RawRoleData extends RoleDataSnapshot{
    org_id: string;
}

export interface RoleData extends RoleDataSnapshot{
    organization: Organization;
    admin_of_organization: Organization;
    maintained_teams: Team[];
}