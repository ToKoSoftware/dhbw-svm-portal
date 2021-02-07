import {UserData} from './user.interface';
import {EventData} from './event.interface';

export interface EventRegistrationData {
  id?: string;
  body: string;
  payment_done: boolean;
  user_id: string;
  event_id: string;
  user: UserData;
  event: EventData;
}

export interface EventRegistrationCreationData {
  event_id: string;
  body: string;
}
