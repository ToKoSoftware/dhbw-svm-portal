import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawTeamData } from '../../../interfaces/team.interface';
import { CustomError } from '../../../middleware/error-handler';
import { Team } from '../../../models/team.model';
import { Vars } from '../../../vars';

export async function updateTeam(req: Request, res: Response, next: NextFunction): Promise<Response> {
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
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (teamData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Team with given id found' }));
        //next(new CustomError(PortalErrors.NO_TEAM_WITH_GIVEN_ID_FOUND, 400));
    }
    const role_ids: string[] = Vars.currentUser.assigned_roles.map(t => t.id);
    if (!role_ids.includes(teamData.maintain_role_id) && !Vars.currentUserIsAdmin) {
        next(new CustomError(PortalErrors.UNAUTHORIZED_YOU_ARE_NOT_MAINTAINER_OF_THIS_TEAM_AND_NOT_ADMIN, 401));
    }

    // Org_id must not be changed
    delete incomingData.org_id;
    delete incomingData.id;

    const requiredFields = Team.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        next(new CustomError(PortalErrors.FIELDS_MUST_NOT_BE_EMPTY, 400));
    }

    teamData.update(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (teamData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, teamData));
}