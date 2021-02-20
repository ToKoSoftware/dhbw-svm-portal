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

export async function createTeam(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const incomingData: RawTeamData = req.body;
        const mappedIncomingData: RawTeamData = mapTeam(incomingData);

        const requiredFields = Team.requiredFields();
        if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
            return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
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
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }

        if (role === null) {
            return res.status(400).send(wrapResponse(false, {
                error: 'There is no role in your organization with given maintain_role_id'
            }));
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
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
} 