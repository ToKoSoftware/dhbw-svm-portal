import { PollVoteDataSnapshot, RawPollVoteData } from '../interfaces/poll-vote.interface';
import { Vars } from '../vars';

export function mapPollVote(incomingData: PollVoteDataSnapshot, pollAnswerId: string): RawPollVoteData {
    return {
        ...incomingData,
        poll_answer_id: pollAnswerId,
        user_id: Vars.currentUser.id
    };
}