import {OrganizationData} from './organization.interface';
import {EventData} from './event.interface';
import {RoleData} from './role.interface';
import {PollVoteData} from './poll.interface';

export interface UserData {
  id: string;
  email: string;
  username: string;
  password?: string;
  first_name: string;
  last_name: string;
  street: string;
  street_number: string;
  post_code: string;
  city: string;
  is_active: boolean
  gender: 'M' | 'W' | 'D';
  birthday: string;
  createdAt: string;
  updatedAt: string;
  organization?: OrganizationData;
  registered_events: EventData[];
  assigned_roles: RoleData[];
  PollVote?: PollVoteData;
  jwt?: string;
}
