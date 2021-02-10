import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {Vars} from '../../../vars';
import {Membership} from '../../../models/membership.model';
import { RawMembershipData } from '../../../interfaces/membership.interface';

export async function deleteMembership(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawMembershipData = req.body;

    const membershipData = await Membership.findOne({
        where: {
            user_id: incomingData.user_id,
            team_id: req.params.team_id
        }
    });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    if (membershipData === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No membership with given id' }));
    } else if (membershipData.user_id !== null && !currentUserIsAdminOrMatchesId(membershipData.user_id) && !Vars.currentUserIsAdmin ){
        return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
    }


    //Hard delete
    await membershipData.destroy()
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    return res.status(204).send(wrapResponse(true));
}