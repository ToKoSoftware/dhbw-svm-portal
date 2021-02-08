import {OrganizationData} from './organization.interface';
import {TeamData} from './team.interface';
import {UserData} from './user.interface';

export interface RoleData{
  id?: string;
  title: string;
  user_deletable: boolean
  is_active?: boolean;
  organization: OrganizationData;
  admin_of_organization: OrganizationData;
  users: UserData[];
  maintained_teams: TeamData[];
}
