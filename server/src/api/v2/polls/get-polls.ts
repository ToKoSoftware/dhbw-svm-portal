import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Poll } from '../../../models/poll.model';
import { Vars } from '../../../vars';
import { User } from '../../../models/user.model';
import { Organization } from '../../../models/organization.model';
import { PollAnswer } from '../../../models/poll-answer.model';
import { Team } from '../../../models/team.model';

export async function getPoll(req: Request, res: Response): Promise<Response> {
    let success = true;
    const currentDate = new Date();
    // allow polls that expire today to be shown
    currentDate.setDate(currentDate.getDate() - 1);
    const pollData: Poll | null = await Poll
        .scope(
            Vars.currentUserIsAdmin
                ? [{ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }]
                : [{ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }, { method: ['onlyAnswerTeam', Vars.currentUser.teams.map(t => t.id)] }, 'active', { method: ['notExpired', currentDate] }]
        )
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
                include: [User.scope('publicData'), Team, PollAnswer.scope(['full', 'active'])]
            }
        })
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
    let voted = false;
    let totalCount = 0;
    const pollDataWithCount = {
        ...pollData.toJSON(), poll_answers: pollData.poll_answers.map(pollAnswer => {
            const counter = pollAnswer.voted_users.length;
            const answerVoted = !!pollAnswer.voted_users.find(user => user.id === Vars.currentUser.id);
            voted = voted || answerVoted;
            totalCount = totalCount + counter;
            return { ...pollAnswer.toJSON(), user_votes_count: counter, answer_voted: answerVoted };
        }), user_has_voted: voted, total_user_votes_count: totalCount
    };
    return res.send(wrapResponse(true, pollDataWithCount));
}

export async function getPolls(req: Request, res: Response): Promise<Response> {
    let success = true;
    const currentDate = new Date();
    // allow polls that expire today to be shown
    currentDate.setDate(currentDate.getDate() - 1);
    const pollData: Poll[] = await Poll
        .scope(
            Vars.currentUserIsAdmin
                ? [{ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }, 'active', { method: ['notExpired', currentDate] }, 'ordered']
                : [{ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }, { method: ['onlyAnswerTeam', Vars.currentUser.teams.map(t => t.id)] }, 'active', { method: ['notExpired', currentDate] }, 'ordered']
        )
        .findAll(
            {
                include: [Organization, User.scope('publicData'), PollAnswer.scope(['full', 'active'])]
            })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollData === []) {
        return res.send(wrapResponse(true, pollData));
    }
    const pollDataWithCount = pollData.map(poll => {
        let voted = false;
        let count = 0;
        return {
            ...poll.toJSON(), poll_answers: poll.poll_answers.map(pollAnswer => {
                const counter = pollAnswer.voted_users.length;
                const answerVoted = !!pollAnswer.voted_users.find(user => user.id === Vars.currentUser.id);
                voted = voted || answerVoted;
                count = count + counter;
                return { ...pollAnswer.toJSON(), user_votes_count: counter, answer_voted: answerVoted };
            }), user_has_voted: voted, total_user_votes_count: count
        };
    });

    return res.send(wrapResponse(true, pollDataWithCount));
}