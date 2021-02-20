import { NextFunction, Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Vars } from '../../../vars';
import { Membership } from '../../../models/membership.model';
import { RawMembershipData } from '../../../interfaces/membership.interface';
import { Team } from '../../../models/team.model';
import { User } from '../../../models/user.model';
import { PortalErrors } from '../../../enum/errors';
import { CustomError } from '../../../middleware/error-handler';

export async function deleteMembership(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const incomingData: RawMembershipData = req.body;
        const teamId = req.params.id;

        const teamData: Team | null = await Team.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).findByPk(teamId)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        const user = await User.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).findByPk(incomingData.user_id)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (teamData === null || user === null) {
            return res.status(400).send(wrapResponse(false, { error: 'Invalid input data!' }));
        }


        /* If User does not delete it's own membership, 
           check if user is Admin, or is at least maintainer of this team (has maintainer_role_id)*/
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
                    team_id: teamId
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
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}