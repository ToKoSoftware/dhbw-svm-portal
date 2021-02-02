import { PollAnswer } from '../models/poll-answer.model';
import { User } from '../models/user.model';

export interface PollVoteDataSnapshot{
    id?: string;
    title: string;
}

export interface RawPollVoteData extends PollVoteDataSnapshot{
    poll_answer_id: string;
    user_id: string;
}

export interface PollVoteData extends PollVoteDataSnapshot{
    poll_answer: PollAnswer;
    user: User;
}