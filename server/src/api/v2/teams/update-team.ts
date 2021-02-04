import { Request, Response } from 'express';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawPollData } from '../../../interfaces/poll.interface';
import { RawTeamData } from '../../../interfaces/team.interface';
import { Poll } from '../../../models/poll.model';
import { Team } from '../../../models/team.model';

export async function updateTeam(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawTeamData = req.body;
    const teamId = req.params.id;

    const teamData: RawTeamData | null = await Team.findOne(
        {
            where: {
                id: teamId
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (teamData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Team with given id found' }));
    }

    // Maintain_role_id and org_id must not be changed
    if (incomingData.maintain_role_id !== teamData.maintain_role_id || incomingData.org_id !== teamData.org_id) {
        if (incomingData.maintain_role_id !== undefined || incomingData.org_id !== undefined) {
            return res.status(400).send(wrapResponse(false, { error: 'Maintain_role_id and org_id must not be changed!' }));
        }
    }

    const requiredFields = Team.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty'}));
    }
    
    const updatedData: [number, Team[]] = await Team.update(
        incomingData, 
        { 
            where: {
                id: teamId
            },
            returning: true
        })
        .catch(() => {
            success = false;
            return [0, []];
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (updatedData[0] === 0 || updatedData[1] === []) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, updatedData[1]));
}