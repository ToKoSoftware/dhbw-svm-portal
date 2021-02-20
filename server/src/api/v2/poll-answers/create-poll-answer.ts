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

export async function createPollAnswer(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const incomingData: PollAnswerDataSnapshot = req.body;
        const mappedIncomingData: RawPollAnswerData = mapPollAnswer(incomingData, req.params.id);

        const requiredFields = PollAnswer.requiredFields();

        if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
            return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
        }

        const pollData: Poll | null = await Poll
            .scope([ { method: [ 'onlyCurrentOrg', Vars.currentOrganization.id ] } ])
            .findByPk(mappedIncomingData.poll_id)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (pollData === null) {
            return res.status(404).send(wrapResponse(false));
        }

        const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
        if (!maintainedTeamIds.find(id => id == pollData.answer_team_id) && !Vars.currentUserIsAdmin) {
            return res.status(403).send(wrapResponse(false, {
                error: 'You are not allowed to create a PollAnswers for a team you are not maintainer of.'
            }));
        }

        const createdData = await PollAnswer.create(mappedIncomingData)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Could not create PollAnswer' }));
        }

        return res.send(wrapResponse(true, createdData));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}