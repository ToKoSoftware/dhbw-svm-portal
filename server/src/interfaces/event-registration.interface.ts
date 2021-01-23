import { Event } from '../models/event.model';
import { User } from '../models/user.model';

export interface EventRegistrationDataSnapshot{
    id?: string;
    body: string;
    payment_done: boolean;
}

export interface RawEventRegistrationData extends EventRegistrationDataSnapshot{
    user_id: string;
    event_id: string;
}

export interface EventRegistrationData extends EventRegistrationDataSnapshot{
    user: User;
    event: Event;
}