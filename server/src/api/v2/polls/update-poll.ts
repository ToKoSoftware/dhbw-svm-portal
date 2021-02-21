import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawPollData } from '../../../interfaces/poll.interface';
import { CustomError } from '../../../middleware/error-handler';
import { Poll } from '../../../models/poll.model';
import { Vars } from '../../../vars';

export async function updatePoll(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const incomingData: RawPollData = req.body;
    const pollId = req.params.id;

    const pollData: Poll | null = await Poll.findByPk(pollId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Poll with given id found' }));
        //next(new CustomError(PortalErrors.NO_POLL_WITH_GIVEN_ID_FOUND, 400));
    }

    // Author_id and org_id must not be changed
    delete incomingData.author_id;
    delete incomingData.org_id;
    delete incomingData.id;

    const requiredFields = Poll.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        next(new CustomError(PortalErrors.FIELDS_MUST_NOT_BE_EMPTY, 400));
    }

    const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
    if (!maintainedTeamIds.find(id => id == pollData.answer_team_id) && !Vars.currentUserIsAdmin) {
        next(new CustomError(PortalErrors.YOU_ARE_NOT_ALLOWED_TO_UPDATE_TO_A_POLL_FOR_A_TEAM_YOU_ARE_NOT_MAINTAINER_OF, 403));
    }


    pollData.update(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, pollData));
}