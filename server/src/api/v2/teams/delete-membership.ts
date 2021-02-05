import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {Vars} from '../../../vars';
import {Membership} from '../../../models/membership.model';

export async function deleteMembership(req: Request, res: Response): Promise<Response> {
    let success = true;
    
    //check if currentUser is admin oder member
    const memberhsipToDelete = await Membership.findOne({
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

    if (memberhsipToDelete === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No membership with given id' }));
    }

    if(memberhsipToDelete !== null) {
        if (memberhsipToDelete.user_id !== null) {
            if (!currentUserIsAdminOrMatchesId(memberhsipToDelete.user_id)) {
                if (!Vars.currentUser.is_admin) {
                    return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
                }
            }
        }
    }

    //Harddelete
    const destroyedRows = await Membership.destroy(
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
        return res.status(404).send(wrapResponse(false, {error: 'There is no membership to delete with this id'}));
    }
    return res.status(204).send(wrapResponse(true));
}