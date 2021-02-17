import { Request, Response } from 'express';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import { mapPoll } from '../../../functions/map-polls.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawPollData } from '../../../interfaces/poll.interface';
import { Poll } from '../../../models/poll.model';
import { Team } from '../../../models/team.model';
import { Vars } from '../../../vars';

export async function createPoll(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData = req.body;
    const mappedIncomingData: RawPollData = mapPoll(incomingData);

    const requiredFields = Poll.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields, true)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    if (mappedIncomingData.closes_at.toString() === 'Invalid Date') {
        return res.status(400).send(wrapResponse(false, { error: 'Closes_at is not valid' }));
    }

    const team: Team | null = await Team.scope({ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }).findOne({
        where: {
            id: mappedIncomingData.answer_team_id
        }
    })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (team === null) {
        return res.status(400).send(wrapResponse(false, { error: 'There is no team in your organization with given answer_team_id' }));
    }

    const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
    if (!maintainedTeamIds.find(id => id == mappedIncomingData.answer_team_id)) {
        return res.status(403).send(wrapResponse(false, { error: 'You are not allowed to create a Poll for a team you are not maintainer of.' }));
    }

    const createdData = await Poll.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not create Poll' }));
    }

    return res.send(wrapResponse(true, createdData));
}