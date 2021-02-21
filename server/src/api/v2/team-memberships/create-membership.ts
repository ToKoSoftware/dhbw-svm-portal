import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapMembership } from '../../../functions/map-membership.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawMembershipData } from '../../../interfaces/membership.interface';
import { CustomError } from '../../../middleware/error-handler';
import { Membership } from '../../../models/membership.model';
import { Team } from '../../../models/team.model';
import { User } from '../../../models/user.model';
import { Vars } from '../../../vars';

export async function createMembership(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const incomingData: RawMembershipData = req.body;
    const mappedIncomingData: RawMembershipData = mapMembership(incomingData, req.params.id);

    const requiredFields = Membership.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        next(new CustomError(PortalErrors.NOT_ALL_REQUIRED_FIELDS_HAVE_BEEN_SET, 400));
    }
    const user = await User.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).findByPk(mappedIncomingData.user_id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    const team = await Team.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).findByPk(mappedIncomingData.team_id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (team === null || user === null) {
        return res.status(404).send(wrapResponse(false, { error: 'Invalid input data!' }));
        //next(new CustomError(PortalErrors.INVALID_INPUT_DATA, 404));
    }

    const role_ids: string[] = Vars.currentUser.assigned_roles.map(t => t.id);
    if (!role_ids.includes(team.maintain_role_id) && !Vars.currentUserIsAdmin) {
        next(new CustomError(PortalErrors.UNAUTHORIZED_YOU_ARE_NOT_MAINTAINER_OF_THIS_TEAM_AND_NOT_ADMIN, 401));
    }

    // Check if user is already member of team. If not, create entry.
    const createdData = await Membership.scope('full').findOrCreate(
        {
            where: {
                user_id: mappedIncomingData.user_id,
                team_id: mappedIncomingData.team_id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }

    return res.send(wrapResponse(true, createdData));
}