import { Team } from '../models/team.model';
import { User } from '../models/user.model';

export interface MembershipDataSnapshot{
    id?: string;
}

export interface RawMembershipData extends MembershipDataSnapshot{
    team_id: string;
    user_id: string;
}

export interface MembershipData extends MembershipDataSnapshot{
    user: User;
    team: Team;
}