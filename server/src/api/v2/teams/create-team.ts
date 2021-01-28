import { Request, Response } from 'express';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapTeam } from '../../../functions/map-teams.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawTeamData } from '../../../interfaces/team.interface';
import { Team } from '../../../models/team.model';

export async function createTeam(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawTeamData = req.body;
    const mappedIncomingData: RawTeamData = mapTeam(incomingData);

    const requiredFields = Team.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    const createdData = await Team.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not create Team' }));
    }

    return res.send(wrapResponse(true, createdData));
} 