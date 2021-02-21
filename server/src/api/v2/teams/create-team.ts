import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { mapTeam } from '../../../functions/map-teams.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawTeamData } from '../../../interfaces/team.interface';
import { CustomError } from '../../../middleware/error-handler';
import { Role } from '../../../models/role.model';
import { Team } from '../../../models/team.model';
import { Vars } from '../../../vars';

export async function createTeam(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const incomingData: RawTeamData = req.body;
    const mappedIncomingData: RawTeamData = mapTeam(incomingData);

    const requiredFields = Team.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        next(new CustomError(PortalErrors.NOT_ALL_REQUIRED_FIELDS_HAVE_BEEN_SET, 400));
    }

    const role: Role | null = await Role.scope({
        method: [ 'onlyCurrentOrg',
            Vars.currentOrganization.id ]
    }).findByPk(mappedIncomingData.maintain_role_id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }

    if (role === null) {
        next(new CustomError(PortalErrors.THERE_IS_NO_ROLE_IN_YOUR_ORGANIZATION_WITH_GIVEN_MAINTAIN_ROLE_ID, 400));
    }

    const createdData = await Team.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });

    if (!success) {
        next(new CustomError(PortalErrors.COULD_NOT_CREATE_TEAM, 500));
    }

    return res.send(wrapResponse(true, createdData));
} 