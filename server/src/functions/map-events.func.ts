import { EventDataSnapshot, RawEventData } from '../interfaces/event.interface';
import { Vars } from '../vars';

export function mapEvent(incomingData: EventDataSnapshot): RawEventData {
    return {
        ...incomingData,
        start_date: new Date(incomingData.start_date),
        end_date: new Date(incomingData.end_date),
        author_id: Vars.currentUser.id,
        org_id: Vars.currentOrganization.id
    };
} 