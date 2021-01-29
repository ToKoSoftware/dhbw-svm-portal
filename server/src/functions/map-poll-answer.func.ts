import { PollAnswerDataSnapshot, RawPollAnswerData } from "../interfaces/poll-answer.interface";

export function mapPollAnswer(incomingData: PollAnswerDataSnapshot, poll_id: string): RawPollAnswerData {
    return {
        ...incomingData,
        poll_id: poll_id
    };
}