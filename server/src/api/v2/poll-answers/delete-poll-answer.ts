import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../../../enum/errors';
import { getMaintainedTeamIdsOfCurrentUser } from '../../../functions/get-maintained-team-ids-of-current-user.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { CustomError } from '../../../middleware/error-handler';
import { PollAnswer } from '../../../models/poll-answer.model';
import { PollVote } from '../../../models/poll-vote.model';
import { Poll } from '../../../models/poll.model';
import { Vars } from '../../../vars';

export async function deletePollAnswer(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;

    const pollAnswerData: PollAnswer | null = await PollAnswer.findByPk(req.params.id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (pollAnswerData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'There is no active PollAnswer with the given id!' }));
        //next(new CustomError(PortalErrors.THERE_IS_NO_ACTIVE_POLLANSWER_WITH_THE_GIVEN_ID, 400));
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
        next(new CustomError(PortalErrors.YOU_ARE_NOT_ALLOWED_TO_DELETE_A_POLLANSWER_FOR_A_TEAM_YOU_ARE_NOT_MAINTAINER_OF, 403));
    }


    await pollAnswerData.destroy()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        //return res.status(500).send(wrapResponse(false, { error: 'Could not delete pollanswer with id ' + req.params.id }));
        next(new CustomError(PortalErrors.COULD_NOT_DELETE_POLLANSWER_WITH_ID, 500));
    }

    await PollVote.destroy(
        {
            where: {
                poll_answer_id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }

    return res.status(204).send(wrapResponse(true));


}