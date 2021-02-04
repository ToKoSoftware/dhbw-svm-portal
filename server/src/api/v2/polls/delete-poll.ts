import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Poll} from '../../../models/poll.model';
import {PollAnswer} from '../../../models/poll-answer.model';

export async function deletePoll(req: Request, res: Response): Promise<Response> {
    let success = true;
    //TODO Authoriaztion check, if polls can get created by no-admins
    await Poll.update(
        {
            is_active: false,
        },
        {
            where: {
                id: req.params.id,
                is_active: true
            }
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
                poll_id: req.params.id,
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