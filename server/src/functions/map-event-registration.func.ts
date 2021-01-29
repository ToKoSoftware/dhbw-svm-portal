import { EventRegistrationDataSnapshot, RawEventRegistrationData } from '../interfaces/event-registration.interface';
import { Vars } from '../vars';

export function mapEventRegistration(incomingData: EventRegistrationDataSnapshot, event_id: string): RawEventRegistrationData {
    return {
        ...incomingData,
        payment_done: false,
        user_id: Vars.currentUser.id,
        event_id: event_id
    };
}