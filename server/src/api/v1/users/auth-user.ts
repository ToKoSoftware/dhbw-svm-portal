import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {UserData} from '../../../interfaces/users.interface';
import {mapUser} from '../../../functions/map-users.func';
import {User} from '../../../models/user.model';
import * as bcrypt from 'bcryptjs';
import {jwtSign} from '../../../functions/jwt-sign.func';

export async function loginUser(req: Request, res: Response): Promise<Response> {

    const incomingData: UserData = req.body;
    const mappedIncomingData: UserData = await mapUser(incomingData);

    let success = true;

    const user = await User.findOne(
        {
            where: {
                email: mappedIncomingData.email,
            }
        })
        .catch(() => {
            success = false;
            return null;
        });


    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (user === null) {
        return res.status(403).send(wrapResponse(false, {error: 'Unauthorized'}));
    } else {
        const passwordMatches = await bcrypt.compare(incomingData.password, user.password)
            .catch(() => false);
        if (passwordMatches) {
            const token = jwtSign(user);
            return res.send(wrapResponse(true, token));
        }
        return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
    }
}

