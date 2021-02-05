import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {Vars} from '../../../vars';
import {PollVote} from '../../../models/poll-vote.model';

export async function deletePollVote(req: Request, res: Response): Promise<Response> {
    let success = true;
    
    //check if currentUser is admin oder voted User
    const pollVoteToDelete = await PollVote.findOne({
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

    if (pollVoteToDelete === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No poll-vote with given id' }));
    } else if (pollVoteToDelete.user_id !== null && !currentUserIsAdminOrMatchesId(pollVoteToDelete.user_id) && !Vars.currentUser.is_admin ){
        return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
    }
           
    //Hard delete
    await pollVoteToDelete.destroy()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    return res.status(204).send(wrapResponse(true));
}