import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { Team } from '../../../models/team.model';
import { Membership } from '../../../models/membership.model';
import { PollAnswer } from '../../../models/poll-answer.model';
import { Poll } from '../../../models/poll.model';
//import { Transaction } from 'sequelize';
//import { Vars } from '../../../vars';

export async function deleteTeam(req: Request, res: Response): Promise<Response> {
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
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (deletePoll === []) {
        return res.status(404).send(wrapResponse(false, { error: 'No poll with given id' }));
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
    }
    // await transaction.commit();
    return res.status(204).send(wrapResponse(true));
    //} catch (error) {
    // await transaction.rollback();
    // return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    //}
}