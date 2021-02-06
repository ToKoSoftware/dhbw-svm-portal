import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Poll } from '../../../models/poll.model';
import { PollAnswer } from '../../../models/poll-answer.model';

export async function deletePoll(req: Request, res: Response): Promise<Response> {
    let success = true;
    const pollId: string = req.params.id;

    const pollData: Poll | null = await Poll.scope('active').findByPk(pollId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No poll with given id found!' }));
    }

    await pollData.update(
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
        return res.status(500).send(wrapResponse(false, { error: 'Could not deactivate poll with id ' + pollId }));
    }

    await PollAnswer.update(
        {
            is_active: false,
        },
        {
            where: {
                poll_id: pollId,
                is_active: true
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not deactivate pollanswer belonging to poll with id ' + pollId }));
    }

    return res.status(204).send(wrapResponse(true));


}