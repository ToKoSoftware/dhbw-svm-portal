import { Request, Response } from 'express';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapMembership } from '../../../functions/map-membership.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawMembershipData } from '../../../interfaces/membership.interface';
import { Membership } from '../../../models/membership.model';
import { Team } from '../../../models/team.model';
import { Vars } from '../../../vars';

export async function createMembership(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawMembershipData = req.body;
    const mappedIncomingData: RawMembershipData = mapMembership(incomingData, req.params.id);

    const requiredFields = Membership.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    const team = await Team.findByPk(mappedIncomingData.team_id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (team === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No Team with given id' }));
    }

    const role_ids: string[] = Vars.currentUser.assigned_roles.map(t => t.id);
    if (!role_ids.includes(team.maintain_role_id)) {
        return res.status(401).send(wrapResponse(false, { error: 'Unauthorized! You are not maintainer of this team.' }));
    }

    // Check if user is already member of team. If not, create entry.
    const createdData = await Membership.scope('full').findOrCreate(
        {
            where: {
                user_id: mappedIncomingData.user_id,
                team_id: mappedIncomingData.team_id
            }
        })
        .catch((error) => {
            Vars.loggy.log(error);
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, createdData));
}