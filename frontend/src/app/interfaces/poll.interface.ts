import {UserData} from './user.interface';
import {TeamData} from './team.interface';
import {OrganizationData} from './organization.interface';

export interface PollData {
  user_has_voted: boolean;
  createdAt: string;
  id?: string;
  title: string;
  body: string;
  closes_at: Date;
  is_active?: boolean;
  author: UserData;
  organization: OrganizationData;
  answer_team: TeamData;
  poll_answers: PollAnswerData[];
}

export interface PollAnswerData {
  createdAt: string;
  id?: string;
  title: string;
  is_active?: boolean;
  voted_users: UserData[];
  user_votes_count: number;
}
