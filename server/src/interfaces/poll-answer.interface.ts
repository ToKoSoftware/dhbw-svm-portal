import { PollVote } from '../models/poll-vote.model';
import { Poll } from '../models/poll.model';
import { User } from '../models/user.model';

export interface PollAnswerDataSnapshot{
    id?: string;
    title: string;
}

export interface RawPollAnswerData extends PollAnswerDataSnapshot{
    poll_id: string;
}

export interface PollAnswerData extends PollAnswerDataSnapshot{
    poll: Poll;
    voted_users: Array<User & {poll_vote: PollVote}>;
}