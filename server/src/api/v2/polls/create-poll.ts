import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import { mapPoll } from '../../../functions/map-polls.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawPollData } from '../../../interfaces/poll.interface';
import { CustomError } from '../../../middleware/error-handler';
import { Poll } from '../../../models/poll.model';
import { Team } from '../../../models/team.model';
import { Vars } from '../../../vars';

export async function createPoll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const incomingData = req.body;
    const mappedIncomingData: RawPollData = mapPoll(incomingData);

    const requiredFields = Poll.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields, true)) {
        next(new CustomError(PortalErrors.NOT_ALL_REQUIRED_FIELDS_HAVE_BEEN_SET, 400));
    }

    if (mappedIncomingData.closes_at.toString() === 'Invalid Date') {
        next(new CustomError(PortalErrors.CLOSES_AT_IS_NOT_VALID, 400));
    }

    const team: Team | null = await Team.scope({ method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] }).findOne({
        where: {
            id: mappedIncomingData.answer_team_id
        }
    })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (team === null) {
        next(new CustomError(PortalErrors.THERE_IS_NO_TEAM_IN_YOUR_ORGANIZATION_WITH_GIVEN_ANSWER_TEAM_ID, 400));
    }

    const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
    if (!maintainedTeamIds.find(id => id == mappedIncomingData.answer_team_id) && !Vars.currentUserIsAdmin) {
        next(new CustomError(PortalErrors.YOU_ARE_NOT_ALLOWED_TO_CREATE_A_POLL_FOR_A_TEAM_YOU_ARE_NOT_MAINTAINER_OF, 403));
    }

    const createdData = await Poll.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.COULD_NOT_CREATE_POLL, 500));
    }

    return res.send(wrapResponse(true, createdData));
}