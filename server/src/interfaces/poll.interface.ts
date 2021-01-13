import { Organization } from '../models/organization.model';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';

export interface PollDataSnapshot{
    id?: string;
    title: string;
    body: string;
    closes_at: Date;
    is_active?: boolean;
}

export interface RawPollData extends PollDataSnapshot{
    author_id: string;
    org_id: string;
    answer_team_id: string;
}

export interface PollData extends PollDataSnapshot{
    author: User;
    organization: Organization;
    answer_team: Team;
}