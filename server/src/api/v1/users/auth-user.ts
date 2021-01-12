import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {UserLoginData} from '../../../interfaces/users.interface';
import {User} from '../../../models/user.model';
import * as bcrypt from 'bcryptjs';
import {jwtSign} from '../../../functions/jwt-sign.func';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';

export async function loginUser(req: Request, res: Response): Promise<Response> {

    const incomingData: UserLoginData = req.body;

    if (!checkKeysAreNotEmptyOrNotSet(incomingData, ['email', 'password']) || !checkKeysAreNotEmptyOrNotSet(incomingData, ['user', 'password'])){
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    let success = true;
    let user: User | null;
    if (incomingData.email !== undefined) {
        user = await User.findOne(
            {
                where: {
                    email: incomingData.email,
                }
            })
            .catch(() => {
                success = false;
                return null;
            });
    } else if (incomingData.username !== undefined) {
        user = await User.findOne(
            {
                where: {
                    username: incomingData.username,
                }
            })
            .catch(() => {
                success = false;
                return null;
            });
    } else {
        user = null;
    }


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

