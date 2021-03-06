import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Vars } from '../../../vars';
import { PollVote } from '../../../models/poll-vote.model';

export async function deletePollVote(req: Request, res: Response): Promise<Response> {
    let success = true;

    const pollVoteToDelete = await PollVote.findOne(
        {
            where: {
                poll_answer_id: req.params.pollAnswerId,
                user_id: Vars.currentUser.id
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
        return res.status(404).send(wrapResponse(false, { error: 'No PollVote belonging to the given PollId with your user data found!' }));
    }

    //Hard delete
    await pollVoteToDelete.destroy()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    return res.status(204).send(wrapResponse(true));
}