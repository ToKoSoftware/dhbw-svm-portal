import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Event} from '../../../models/event.model';

export async function deleteEvent(req: Request, res: Response): Promise<Response> {
    let success = true;
    //TODO Authoriaztion check, if events can get created by no-admins
    await Event.update(
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
        return res.status(500).send(wrapResponse(false, {error: 'Could not deactivate Event with id ' + req.params.id}));
    }

    return res.status(204).send(wrapResponse(true));
    
    
}