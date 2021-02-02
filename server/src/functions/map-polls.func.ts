import { RawPollData } from '../interfaces/poll.interface';
import { Vars } from '../vars';

export function mapPoll(incomingData: RawPollData): RawPollData {
    return {
        ...incomingData,
        author_id: Vars.currentUser.id,
        org_id: Vars.currentOrganization.id
    };
}