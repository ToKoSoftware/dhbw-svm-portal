import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {PollAnswer} from '../../../models/poll-answer.model';

export async function deletePollAnswer(req: Request, res: Response): Promise<Response> {
    let success = true;

    const pollAnswerData: PollAnswer | null = await PollAnswer.findByPk(req.params.id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error!'}));
    }
    if (pollAnswerData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'There is no active PollAnswer with the given id!'}));
    }

    await pollAnswerData.update(
        {
            is_active: false,
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