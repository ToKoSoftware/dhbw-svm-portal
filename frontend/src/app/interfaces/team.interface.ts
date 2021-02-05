import {UserData} from './user.interface';

export interface TeamData {
  org_id: string;
  maintain_role_id: string;
  id?: string;
  title: string;
  is_active?: boolean;
  organization: unknown;
  maintain_role: unknown;
  users: UserData;
}
