import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {Vars} from '../../../vars';
import {PollVote} from '../../../models/poll-vote.model';

export async function deletePollVote(req: Request, res: Response): Promise<Response> {
    let success = true;
    
    //check if currentUser is admin oder voted User
    const pollVote_to_delete = await PollVote.findOne({
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

    if (pollVote_to_delete === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No poll-vote with given id' }));
    }

    if(pollVote_to_delete !== null) {
        if (pollVote_to_delete.user_id !== null) {
            if (!currentUserIsAdminOrMatchesId(pollVote_to_delete.user_id)) {
                if (!Vars.currentUser.is_admin) {
                    return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
                }
            }
        }
    }

    //Harddelete
    const destroyedRows = await PollVote.destroy(
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
        return res.status(404).send(wrapResponse(false, {error: 'There is no poll-vote to delete with this id'}));
    }
    return res.status(204).send(wrapResponse(true));
}