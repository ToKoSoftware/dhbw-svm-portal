import { RawMembershipData } from '../interfaces/membership.interface';

export function mapMembership(incomingData: RawMembershipData, team_id: string): RawMembershipData {
    return {
        ...incomingData,
        team_id: team_id 
        // TODO user_id setzten auf current_user.id?
    };
}