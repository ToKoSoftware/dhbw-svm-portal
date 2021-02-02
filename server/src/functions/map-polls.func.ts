import { RawPollData } from '../interfaces/poll.interface';
import { Vars } from '../vars';

export function mapPoll(incomingData: RawPollData): RawPollData {
    return {
        ...incomingData,
        closes_at: new Date(incomingData.closes_at),
        author_id: Vars.currentUser.id,
        org_id: Vars.currentOrganization.id
    };
}