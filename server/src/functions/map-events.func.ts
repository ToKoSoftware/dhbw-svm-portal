import { EventDataSnapshot, RawEventData } from '../interfaces/event.interface';
import { Vars } from '../vars';

export function mapEvent(incomingData: EventDataSnapshot): RawEventData {
    return {
        ...incomingData,
        author_id: Vars.currentUser.id,
        org_id: Vars.currentOrganization.id
    };
} 