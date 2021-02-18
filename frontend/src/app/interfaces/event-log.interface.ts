import {UserData} from './user.interface';

export interface EventLogData {
  id: string;
  user: UserData;
  called_function: string;
  createdAt: string;
  updatedAt: string;
}
