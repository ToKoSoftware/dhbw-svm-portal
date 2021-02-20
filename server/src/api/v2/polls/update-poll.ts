import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawPollData } from '../../../interfaces/poll.interface';
import { CustomError } from '../../../middleware/error-handler';
import { Poll } from '../../../models/poll.model';
import { Vars } from '../../../vars';

export async function updatePoll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        let success = true;
        const incomingData: RawPollData = req.body;
        const pollId = req.params.id;

        const pollData: Poll | null = await Poll.findByPk(pollId)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (pollData === null) {
            return res.status(400).send(wrapResponse(false, { error: 'No Poll with given id found' }));
        }

        // Author_id and org_id must not be changed
        delete incomingData.author_id;
        delete incomingData.org_id;
        delete incomingData.id;

        const requiredFields = Poll.requiredFields();
        if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
            return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));
        }

        const maintainedTeamIds = await getMaintainedTeamIdsOfCurrentUser();
        if (!maintainedTeamIds.find(id => id == pollData.answer_team_id) && !Vars.currentUserIsAdmin) {
            return res.status(403).send(wrapResponse(false, {
                error: 'You are not allowed to update a Poll for a team you are not maintainer of.'
            }));
        }


        pollData.update(incomingData)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (pollData === null) {
            return res.send(wrapResponse(true, { info: 'Nothing updated' }));
        }

        return res.send(wrapResponse(true, pollData));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}