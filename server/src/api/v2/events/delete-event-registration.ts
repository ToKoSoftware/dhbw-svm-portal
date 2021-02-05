import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {EventRegistration} from '../../../models/event-registration.model';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {Vars} from '../../../vars';

export async function deleteEventRegistration(req: Request, res: Response): Promise<Response> {
    let success = true;
    
    //check if currentUser is admin oder registeredUser
    const eventRegistrationToDelete = await EventRegistration.findOne({
        where: {
            id: req.params.id
        }
    })
        .catch(() => {
            success = false;
            return null;
        });


    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    if (eventRegistrationToDelete === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No event-registration with given id' }));
    } else if (eventRegistrationToDelete.user_id !== null && !currentUserIsAdminOrMatchesId(eventRegistrationToDelete.user_id)  && !Vars.currentUser.is_admin) { //elseif (zeile 31,32,33)
        return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
    }

    //Hard delete
    await eventRegistrationToDelete.destroy()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    
    return res.status(204).send(wrapResponse(true));
}
