import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Poll} from '../../../models/poll.model';
import {Vars} from '../../../vars';
import {User} from '../../../models/user.model';
import {Organization} from '../../../models/organization.model';
import {PollAnswer} from '../../../models/poll-answer.model';
import {Team} from '../../../models/team.model';
import {PollVote} from '../../../models/poll-vote.model';

/**
 * {
  id: 123,
  title: "Was geht",
  total_count: 44,
  answers: [{
    id: 12
    title: 12,
    vote_count: 22
  }],
  user_voted_for: {
    id: 22,
    title: 12
  }
    }
 */

export async function getPoll(req: Request, res: Response): Promise<Response> {
    let success = true;

    const pollData: Poll | null = await Poll
        .scope({method: ['onlyCurrentOrg', Vars.currentOrganization.id]})
        .findOne({
            where: {
                id: req.params.id
            },
            ...Vars.currentUserIsAdmin ? {
                include: [Organization, User, Team, PollAnswer.scope(['full', 'active'])]
            } : {
                where: {
                    answer_team_id: Vars.currentUser.teams.map(t => t.id)
                },
                include: {
                    model: User.scope('publicData')
                }
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (pollData === null) {
        return res.status(404).send(wrapResponse(false));
    }
    const count = await PollVote.count(
        {
            where: {
                poll_answer_id: pollData.poll_answers.map(t => t.id)
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    const pollDataWithCount = {...pollData.toJSON(), total_user_votes_count: count};
    return res.send(wrapResponse(true, pollDataWithCount));
}

export async function getPolls(req: Request, res: Response): Promise<Response> {
// Fehlt: Count auf jeder answer
// Count auf poll_voted_users wie oben
// user hat abgestimmt ja nein auf PollAnswer
// user hat abgestimmt ja nein auf Poll

    let success = true;
    const currentDate = new Date();
    // allow polls that expire today to be shown
    currentDate.setDate(currentDate.getDate() - 1);
    const data = await Poll.scope(['active', {method: ['notExpired', currentDate]}, 'ordered']).findAll(
        {
            include: [Organization, User, Team, PollAnswer.scope(['full', 'active'])]
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    return res.send(wrapResponse(true, data));
}
