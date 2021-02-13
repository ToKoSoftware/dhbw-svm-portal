import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Vars } from '../../../vars';
import { Membership } from '../../../models/membership.model';
import { RawMembershipData } from '../../../interfaces/membership.interface';
import { Team } from '../../../models/team.model';

export async function deleteMembership(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawMembershipData = req.body;

    const teamData: Team | null = await Team.scope({ method: ['onlyCurrentOrg', Vars.currentOrganization.id] }).findByPk(incomingData.team_id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (teamData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No team with given id found!' }));
    }

    // If User does not delete it's own membership, check if user is Admin, or is at least maintainer of this team (has maintainer_role_id)
    if (Vars.currentUser.id != incomingData.user_id) {
        if (!Vars.currentUserIsAdmin) {
            const roleIds = Vars.currentUser.assigned_roles.map(r => r.id);
            if (!roleIds.find(el => el === teamData.maintain_role_id)) {
                return res.status(403).send(wrapResponse(false, { error: 'Forbidden!' }));
            }
        }
    }

    const membershipData = await Membership.findOne(
        {
            where: {
                user_id: incomingData.user_id,
                team_id: req.params.team_id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    if (membershipData === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No membership with given data' }));
    }

    //Hard delete
    await membershipData.destroy()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    return res.status(204).send(wrapResponse(true));
}