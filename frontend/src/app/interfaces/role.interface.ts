import {OrganizationData} from './organization.interface';
import {TeamData} from './team.interface';

export interface RoleData{
  id?: string;
  title: string;
  user_deletable: boolean
  is_active?: boolean;
  organization: OrganizationData;
  admin_of_organization: OrganizationData;
  maintained_teams: TeamData[];
}
