import {UserData} from './user.interface';

export interface TeamData {
  id?: string;
  createdAt: string;
  org_id: string;
  maintain_role_id: string;
  title: string;
  is_active?: boolean;
  organization: unknown;
  maintain_role: unknown;
  users: UserData;
}
