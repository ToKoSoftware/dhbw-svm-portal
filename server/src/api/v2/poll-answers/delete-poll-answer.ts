import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {PollAnswer} from '../../../models/poll-answer.model';

export async function deletePollAnswer(req: Request, res: Response): Promise<Response> {
    let success = true;
    //TODO Authoriaztion check, if poll-answers can get created by no-admins

    await PollAnswer.update(
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
        return res.status(500).send(wrapResponse(false, {error: 'Could not deactivate pollanswer with id ' + req.params.id}));
    }

    return res.status(204).send(wrapResponse(true));
    
    
}