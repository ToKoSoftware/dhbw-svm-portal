import { Request, Response } from 'express';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawTeamData } from '../../../interfaces/team.interface';
import { Team } from '../../../models/team.model';
import { Vars } from '../../../vars';

export async function updateTeam(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawTeamData = req.body;
    const teamId = req.params.id;

    const teamData: Team | null = await Team.findByPk(teamId)
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
    const role_ids: string[] = Vars.currentUser.assigned_roles.map(t => t.id);
    if (!role_ids.includes(teamData.maintain_role_id) && !Vars.currentUserIsAdmin) {
        return res.status(401).send(wrapResponse(false, { error: 'Unauthorized! You are not maintainer of this team and not admin!' }));
    }

    // Org_id must not be changed
    delete incomingData.org_id;
    delete incomingData.id;

    const requiredFields = Team.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));
    }

    teamData.update(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (teamData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, teamData));
}