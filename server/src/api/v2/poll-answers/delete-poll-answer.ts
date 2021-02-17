import {Request, Response} from 'express';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {PollAnswer} from '../../../models/poll-answer.model';
import { PollVote } from '../../../models/poll-vote.model';
import { Poll } from '../../../models/poll.model';
import { Vars } from '../../../vars';

export async function deletePollAnswer(req: Request, res: Response): Promise<Response> {
    let success = true;

    const pollAnswerData: PollAnswer | null = await PollAnswer.scope('includePoll').findByPk(req.params.id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error!'}));
    }
    if (pollAnswerData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'There is no active PollAnswer with the given id!'}));
    }
    if (pollAnswerData.poll.org_id !== Vars.currentOrganization.id) {
        return res.status(403).send(wrapResponse(false, { error: 'Forbidden!'}));
    }

    const pollData: Poll | null = await Poll.findByPk(pollAnswerData.poll_id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Poll with given id found' }));
    }

    const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
    if (!maintainedTeamIds.find(id => id == pollData.answer_team_id) && !Vars.currentUserIsAdmin) {
        return res.status(403).send(wrapResponse(false, { error: 'You are not allowed to create a PollAnswers for a team you are not maintainer of.' }));
    }


    await pollAnswerData.update(
        {
            is_active: false,
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not deactivate pollanswer with id ' + req.params.id}));
    }

    await PollVote.destroy(
        {
            where: {
                poll_answer_id: pollAnswerData.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    return res.status(204).send(wrapResponse(true));
    
    
}