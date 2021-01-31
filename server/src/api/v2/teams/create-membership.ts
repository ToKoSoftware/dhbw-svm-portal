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
 
    const team = await Team.findOne({
        where: {
            id: mappedIncomingData.team_id
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
        return res.status(404).send(wrapResponse(false, { error: 'No Team with given id' }));
    }
   
    const role_ids: string[] = Vars.currentUser.assigned_roles.map(t => t.id);
    if (!role_ids.includes(team.maintain_role_id)){
        return res.status(401).send(wrapResponse(false, { error: 'Unauthorized! You are not maintainer of this team.' }));
    }

    // Check if user is already registered for team
    const membershipCount = await Membership.count(
        {
            where: {
                user_id: mappedIncomingData.user_id,
                team_id: mappedIncomingData.team_id
            }
        })
        .catch(() => {
            success = false;
            return 0;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (membershipCount !== 0) {
        return res.status(400).send(wrapResponse(false, { error: 'User is already in this Team' }));
    }


    const createdData = await Membership.scope('full').create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, createdData));
}