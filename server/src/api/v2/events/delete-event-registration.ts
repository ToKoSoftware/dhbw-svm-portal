import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {EventRegistration} from '../../../models/event-registration.model';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {Vars} from '../../../vars';

export async function deleteEventRegistration(req: Request, res: Response): Promise<Response> {
    let success = true;
    
    //check if currentUser is admin oder registeredUser
    const eventRegistration_to_delete = await EventRegistration.findOne({
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

    if (eventRegistration_to_delete === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No event-registration with given id' }));
    }

    if(eventRegistration_to_delete !== null) {
        if (eventRegistration_to_delete.user_id !== null) {
            if (!currentUserIsAdminOrMatchesId(eventRegistration_to_delete.user_id)) {
                if (!Vars.currentUser.is_admin) {
                    return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
                }
            }
        }
    }

    // Hard delete
    const destroyedRows = await EventRegistration.destroy(
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
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (destroyedRows == 0) {
        return res.status(404).send(wrapResponse(false, {error: 'There is no event-registration to delete with this id'}));
    }
    return res.status(204).send(wrapResponse(true));
}
