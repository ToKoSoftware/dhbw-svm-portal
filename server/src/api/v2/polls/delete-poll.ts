import { NextFunction, Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Poll } from '../../../models/poll.model';
import { PollAnswer } from '../../../models/poll-answer.model';
import { PollVote } from '../../../models/poll-vote.model';
import { Vars } from '../../../vars';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import { PortalErrors } from '../../../enum/errors';
import { CustomError } from '../../../middleware/error-handler';

export async function deletePoll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const pollId: string = req.params.id;

        const pollData: Poll | null = await Poll.findByPk(pollId)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (pollData === null) {
            return res.status(400).send(wrapResponse(false, { error: 'No poll with given id found!' }));
        }

        const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
        if (!maintainedTeamIds.find(id => id == pollData.answer_team_id) && !Vars.currentUserIsAdmin) {
            return res.status(403).send(wrapResponse(false, {
                error: 'You are not allowed to delete a Poll for a team you are not maintainer of.'
            }));
        }

        await pollData.destroy()
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Could not delete poll with id ' + pollId }));
        }

        const pollAnswerData: PollAnswer[] = await PollAnswer.findAll(
            {
                where: {
                    poll_id: pollId
                }
            })
            .catch(() => {
                success = false;
                return [];
            });
        if (!success || pollAnswerData === []) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }

        const pollAnswerIds = pollAnswerData.map(p => p.id);

        pollAnswerData.forEach(pollAnswer => pollAnswer.destroy());

        await PollVote.destroy(
            {
                where: {
                    poll_answer_id: pollAnswerIds
                }
            })
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Could not delete PollVotes belonging to poll with id ' + pollId }));
        }
        return res.status(204).send(wrapResponse(true));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}