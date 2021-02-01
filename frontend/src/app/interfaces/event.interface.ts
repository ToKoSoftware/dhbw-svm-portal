import {UserData} from './user.interface';

export interface EventDataSnapshot{
  id?: string;
  title: string;
  description: string;
  price: number | null;
  start_date: string;
  end_date: string;
  max_participants: number | null;
  is_active?: boolean;
}

export interface EventData extends EventDataSnapshot{
  createdAt: string;
  organization: unknown;
  author: UserData;
  registered_users: Array<UserData>
}
