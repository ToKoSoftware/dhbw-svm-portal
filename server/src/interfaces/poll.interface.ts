import { Organization } from '../models/organization.model';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';

export interface PollDataSnapshot{
    id?: string;
    title: string;
    body: string;
    closes_at: Date;
}

export interface RawPollData extends PollDataSnapshot{
    author_id?: string;
    org_id?: string;
    answer_team_id: string | null;
}

export interface PollData extends PollDataSnapshot{
    author: User;
    organization: Organization;
    answer_team: Team;
}