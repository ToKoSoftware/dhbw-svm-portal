import { NextFunction, Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Team } from '../../../models/team.model';
import { Membership } from '../../../models/membership.model';
import { PollAnswer } from '../../../models/poll-answer.model';
import { Poll } from '../../../models/poll.model';
import { PortalErrors } from '../../../enum/errors';
import { CustomError } from '../../../middleware/error-handler';
//import { Transaction } from 'sequelize';
//import { Vars } from '../../../vars';

export async function deleteTeam(req: Request, res: Response, next: NextFunction): Promise<Response> {
    let success = true;
    // const transaction = new Transaction(Vars.db, {});
    // try {
    await Team.destroy(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not delete team with id ' + req.params.id }));
        //next(new CustomError(PortalErrors.COULD_NOT_DELETE_TEAM_WITH_ID, 500));
    }

    await Membership.destroy(
        {
            where: {
                team_id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Could not delete membership with id ' + req.params.id }));
        //next(new CustomError(PortalErrors.COULD_NOT_DELETE_MEMBERSHIP_WITH_ID, 500));
    }

    const deletePoll: Poll[] = await Poll.findAll(
        {
            where: {
                answer_team_id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return [];
        });
    if (!success) {
        next(new CustomError(PortalErrors.DATABASE_ERROR, 500));
    }
    if (deletePoll === []) {
        next(new CustomError(PortalErrors.NO_POLL_WITH_GIVEN_ID, 404));
    }

    deletePoll.forEach(async el => await el.destroy()
        .catch(() => {
            success = false;
            return null;
        })
    );
    if (!success) {
        return res.status(500).send(wrapResponse(
            false,
            { error: 'Could not delete polls belonging to team with id ' + req.params.id }
        ));
        //next(new CustomError(PortalErrors.COULD_NOT_DELETE_POLLS_BELONGING_TO_TEAM_WITH_ID, 500));
    }

    await PollAnswer.destroy({
        where: {
            poll_id: deletePoll.map(t => t.id)
        }
    })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(
            false, { error: 'Could not delete pollanswers belonging to team with id ' + req.params.id }));
        //next(new CustomError(PortalErrors.COULD_NOT_DELETE_POLLANSWERS_BELONGING_TO_TEAM_WITH_ID, 500));
    }
    // await transaction.commit();
    return res.status(204).send(wrapResponse(true));
    //} catch (error) {
    // await transaction.rollback();
    // return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    //}
}