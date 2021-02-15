import {RoleData} from './role.interface';
import {UserData} from './user.interface';
import {EventData} from './event.interface';
import {NewsData} from './news.interface';
import {PollData} from './poll.interface';
import {TeamData} from './team.interface';

export interface OrganizationData {
  id?: string;
  title: string;
  access_code: string;
  privacy_policy_text: string;
  direct_debit_mandate_contract_text: string;
  creditor_id: string;
  config: string;
  is_active?: boolean;
  admin_role: RoleData;
  users: UserData;
  events: EventData;
  news: NewsData;
  polls: PollData;
  roles: RoleData;
  teams: TeamData;
}
