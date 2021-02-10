import {OrganizationData} from './organization.interface';
import {EventData} from './event.interface';

export interface UserData {
  birthday: string;
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
  createdAt: string;
  updatedAt: string;
  organization?: OrganizationData;
  registered_events: EventData[];
}
