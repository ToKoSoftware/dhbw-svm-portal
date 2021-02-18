import { Request, Response } from 'express';
import { mapPollVote } from '../../../functions/map-poll-vote.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { PollAnswer } from '../../../models/poll-answer.model';
import { PollVote } from '../../../models/poll-vote.model';
import { Poll } from '../../../models/poll.model';
import { Vars } from '../../../vars';

export async function voteForPollAnswer(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData = req.body;
    const incomingParams = req.params;
    const mappedIncomingData = mapPollVote(incomingData, incomingParams.pollAnswerId);

    const currentDate = new Date();
    // allow polls that expire today to be shown
    currentDate.setDate(currentDate.getDate() - 1);
    const pollData: Poll | null = await Poll
        .scope(
            [
                { method: ['onlyCurrentOrg', Vars.currentOrganization.id] }, 
                { method: ['onlyAnswerTeam', Vars.currentUser.teams.map(t => t.id), Vars.currentOrganization.public_team_id] }, 
                { method: ['notExpired', currentDate] }
            ])
        .findByPk(incomingParams.pollId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollData === null) {
        return res.status(404).send(wrapResponse(false));
    }
    const pollAnswerData: PollAnswer | null = await PollAnswer.findOne(
        {
            where: {
                id: incomingParams.pollAnswerId,
                poll_id: pollData.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollAnswerData === null) {
        return res.status(404).send(wrapResponse(false));
    }
    if (Vars.currentUser.voted_poll_answers.map(p => p.poll_id).find(el => el === pollData.id)) {
        return res.status(404).send(wrapResponse(false, { error: 'You already voted!' }));
    }

    const createdData = await PollVote.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not create PollVote' }));
    }

    return res.send(wrapResponse(true, createdData));
}