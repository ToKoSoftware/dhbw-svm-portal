import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Team} from '../../../models/team.model';
import {Membership} from '../../../models/membership.model';
import { PollAnswer } from '../../../models/poll-answer.model';
import { Poll } from '../../../models/poll.model';

export async function deleteTeam(req: Request, res: Response): Promise<Response> {
    let success = true;
    //TODO Authoriaztion check, if teams can get created by no-admins
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
        return res.status(500).send(wrapResponse(false, {error: 'Could not delete team with id ' + req.params.id}));
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
        return res.status(500).send(wrapResponse(false, {error: 'Could not delete membership with id ' + req.params.id}));
    }

    // TODO Dominik : findAll!
    const deletePoll = await Poll.findOne(
        {
            where: {
                answer_team_id: req.params.id,
                is_active: true
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (deletePoll === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No poll with given id' }));
    }

    await deletePoll.update(
        {
            is_active: false,
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not deactivate poll with id ' + req.params.id}));
    }

    await PollAnswer.update(
        {
            is_active: false,
        },
        {
            where: {
                poll_id: deletePoll.id,
                is_active: true
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not deactivate pollanswer with id ' + req.params.id}));
    }
    
    return res.status(204).send(wrapResponse(true));
    
    
}