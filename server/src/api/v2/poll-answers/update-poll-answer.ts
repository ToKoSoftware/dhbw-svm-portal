import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawPollAnswerData } from '../../../interfaces/poll-answer.interface';
import { CustomError } from '../../../middleware/error-handler';
import { PollAnswer } from '../../../models/poll-answer.model';
import { Poll } from '../../../models/poll.model';
import { Vars } from '../../../vars';

export async function updatePollAnswer(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    const incomingData: RawPollAnswerData = req.body;
    const pollAnswerId = req.params.id;

    const pollAnswerData: PollAnswer | null = await PollAnswer.findByPk(pollAnswerId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollAnswerData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No PollAnswer with given id found' }));
        next(new CustomError(PortalErrors.NO_POLLANSWER_WITH_GIVEN_ID_FOUND, 400));
    }

    const requiredFields = PollAnswer.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        next(new CustomError(PortalErrors.FIELDS_MUST_NOT_BE_EMPTY, 400));
    }

    const pollData: Poll | null = await Poll.unscoped().findByPk(pollAnswerData.poll_id)
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

    if (pollData.org_id !== Vars.currentOrganization.id) {
        next(new CustomError(PortalErrors.FORBIDDEN, 403));
    }
    const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
    if (!maintainedTeamIds.find(id => id == pollData.answer_team_id) && !Vars.currentUserIsAdmin) {
        next(new CustomError(PortalErrors.YOU_ARE_NOT_ALLOWED_TO_CREATE_A_POLLANSWER_FOR_A_TEAM_YOU_ARE_NOT_MAINTAINER_OF, 403));
    }

    pollAnswerData.update(incomingData)
        .catch(() => {
            success = false;
            return [ 0, [] ];
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollAnswerData === null) {
        return res.send(wrapResponse(true, { info: 'Nothing updated' }));
    }

    return res.send(wrapResponse(true, pollAnswerData));
}