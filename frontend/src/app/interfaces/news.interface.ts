import {UserData} from './user.interface';
import {OrganizationData} from './organization.interface';

export interface NewsData {
  createdAt: string;
  id?: string;
  title: string;
  body: string;
  is_active?: boolean;
  organization: OrganizationData;
  author: UserData;
}
