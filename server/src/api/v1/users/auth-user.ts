import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {UserLoginData} from '../../../interfaces/users.interface';
import {User} from '../../../models/user.model';
import * as bcrypt from 'bcryptjs';
import {jwtSign} from '../../../functions/jwt-sign.func';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { Vars } from '../../../vars';

export async function loginUser(req: Request, res: Response): Promise<Response> {

    const incomingData: UserLoginData = req.body;

    if (!checkKeysAreNotEmptyOrNotSet(incomingData, ['email', 'password']) || !checkKeysAreNotEmptyOrNotSet(incomingData, ['user', 'password'])){
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }

    let success = true;
    const selectStatement = {
        where: {
            is_active: true,
            ...(incomingData?.email ? {email: incomingData.email} : {}),
            ...(incomingData?.username ? {email: incomingData.username} : {}),
        }
    };
    
    const user = await User.scope('verification').findOne(selectStatement)
        .catch((error) => {
            Vars.loggy.log(error);
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
            const userHasAdminRole = user.assigned_roles.findIndex(el => el.id === user.organization.admin_role_id)+1;
            Vars.currentUserIsAdmin = !!userHasAdminRole;
            const token = jwtSign(user);
            return res.send(wrapResponse(true, token));
        }
        return res.status(403).send(wrapResponse(false, {error: 'Unauthorized!'}));
    }
}

