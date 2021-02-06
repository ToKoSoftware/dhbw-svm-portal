import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Team } from '../../../models/team.model';
import { Membership } from '../../../models/membership.model';
import { PollAnswer } from '../../../models/poll-answer.model';
import { Poll } from '../../../models/poll.model';

export async function deleteTeam(req: Request, res: Response): Promise<Response> {
    let success = true;
    await Team.destroy(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not delete team with id ' + req.params.id }));
    }

    await Membership.destroy(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not delete membership with id ' + req.params.id }));
    }

    const deletePoll: Poll[] = await Poll.findAll(
        {
            where: {
                answer_team_id: req.params.id,
                is_active: true
            }
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (deletePoll === []) {
        return res.status(404).send(wrapResponse(false, { error: 'No poll with given id' }));
    }

    deletePoll.forEach(async el => await el.update(
        {
            is_active: false,
        })
        .catch(() => {
            success = false;
            return null;
        })
    );
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not deactivate polls belonging to team with id ' + req.params.id }));
    }

    await PollAnswer.update(
        {
            is_active: false,
        },
        {
            where: {
                poll_id: deletePoll.map(t => t.id),
                is_active: true
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not deactivate pollanswers belonging to team with id ' + req.params.id }));
    }

    return res.status(204).send(wrapResponse(true));
}