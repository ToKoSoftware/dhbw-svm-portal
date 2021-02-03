import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {User} from '../../../models/user.model';
import {Team} from '../../../models/team.model';
import {Membership} from '../../../models/membership.model';
import {TeamData} from '../../../interfaces/team.interface';
import {Vars} from '../../../vars';

export async function deleteTeam(req: Request, res: Response): Promise<Response> {
    let success = true;
    //TODO Authoriaztion check, if teams can get created by no-admins
    await Team.update(
        {
            is_active: false,
        },
        {
            where: {
                id: req.params.id,
                is_active: true
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Could not deactivate Team with id ' + req.params.id}));
    }

    // if  Users are members, you can only set Teams to inactive with information about members
    const count: number = await Membership.count(
        {
            where: {
                team_id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return 0;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    //finding the members of the team which is to delete
    const end: TeamData | null = await Team
        .findOne(
            {
                where: {
                    id: req.params.id,
                    is_active: false
                },
                include: {model: User.scope('publicData')}
            })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    
    if (count > 0) {
        if (end !== null) {
            return res.send(wrapResponse(true, 
                {
                    message: 'Event sucessful deactivated. The following persons should be informed',
                    data: end.users
                }
            ));
        }
    }

    return res.status(204).send(wrapResponse(true));
    
    
}