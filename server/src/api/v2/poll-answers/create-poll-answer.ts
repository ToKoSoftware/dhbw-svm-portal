import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import { mapPollAnswer } from '../../../functions/map-poll-answer.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { PollAnswerDataSnapshot, RawPollAnswerData } from '../../../interfaces/poll-answer.interface';
import { CustomError } from '../../../middleware/error-handler';
import { PollAnswer } from '../../../models/poll-answer.model';
import { Poll } from '../../../models/poll.model';
import { Vars } from '../../../vars';

export async function createPollAnswer(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const incomingData: PollAnswerDataSnapshot = req.body;
    const mappedIncomingData: RawPollAnswerData = mapPollAnswer(incomingData, req.params.id);

    const requiredFields = PollAnswer.requiredFields();

    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        next(new CustomError(PortalErrors.NOT_ALL_REQUIRED_FIELDS_HAVE_BEEN_SET, 400));
    }

    const pollData: Poll | null = await Poll
        .scope([ { method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] } ])
        .findByPk(mappedIncomingData.poll_id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollData === null) {
        return res.status(404).send(wrapResponse(false));
        //next(new CustomError(PortalErrors.NOT_FOUND, 404));
    }

    const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
    if (!maintainedTeamIds.find(id => id == pollData.answer_team_id) && !Vars.currentUserIsAdmin) {
        next(new CustomError(PortalErrors.YOU_ARE_NOT_ALLOWED_TO_CREATE_A_POLLANSWER_FOR_A_TEAM_YOU_ARE_NOT_MAINTAINER_OF, 403));
    }

    const createdData = await PollAnswer.create(mappedIncomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.COULD_NOT_CREATE_POLLANSWER, 500));
    }

    return res.send(wrapResponse(true, createdData));
}