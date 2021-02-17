import { Request, Response } from 'express';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawPollAnswerData } from '../../../interfaces/poll-answer.interface';
import { PollAnswer } from '../../../models/poll-answer.model';
import { Poll } from '../../../models/poll.model';
import { Vars } from '../../../vars';

export async function updatePollAnswer(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawPollAnswerData = req.body;
    const pollAnswerId = req.params.id;

    const pollAnswerData: PollAnswer | null = await PollAnswer.scope('includePoll').findByPk(pollAnswerId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollAnswerData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No PollAnswer with given id found' }));
    }
    if (pollAnswerData.poll.org_id !== Vars.currentOrganization.id) {
        return res.status(403).send(wrapResponse(false, { error: 'Forbidden!'}));
    }
    
    const requiredFields = PollAnswer.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));
    }

    const pollData: Poll | null = await Poll.findByPk(pollAnswerData.poll_id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Poll with given id found' }));
    }

    const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
    if (!maintainedTeamIds.find(id => id == pollData.answer_team_id) && !Vars.currentUserIsAdmin) {
        return res.status(403).send(wrapResponse(false, { error: 'You are not allowed to create a PollAnswers for a team you are not maintainer of.' }));
    }

    pollAnswerData.update(incomingData)
        .catch(() => {
            success = false;
            return [0, []];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (pollAnswerData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, pollAnswerData));
}