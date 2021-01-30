import {UserData} from './user.interface';
import {Organization} from './organization.interface';

export interface NewsData {
  id?: string;
  title: string;
  body: string;
  is_active?: boolean;
  organization: Organization;
  author: UserData;
}
