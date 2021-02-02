import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Event} from '../../../models/event.model';
import {EventRegistration} from '../../../models/event-registration.model';
import {User} from '../../../models/user.model';
import { EventData } from '../../../interfaces/event.interface';

export async function deleteEvent(req: Request, res: Response): Promise<Response> {
    let success = true;
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

    // if  Users are registrated and the end_Date < today, you can only set Event to inactive with information about registred_users 
    const count: number = await EventRegistration.count(
        {
            where: {
                event_id: req.params.id,
            }
        })
        .catch(() => {
            success = false;
            return 0;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    const today = new Date();
    const end: EventData | null = await Event
        .scope([{method: ['not_expired', today]}])
        .findOne(
            {
                where: {
                    id: req.params.id   
                },
                include: {model: User.scope('publicData'), as: 'registered_users'}
            })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    
    if (count > 0) {
        if (end !== null){
            return res.send(wrapResponse(true,
                {
                    ​​​​​message: 'Event sucessful deactivated. The following persons should be informed',
                    data: end.registered_users
                }​​​​​));
        }
    }

    return res.status(204).send(wrapResponse(true));
    
    
}