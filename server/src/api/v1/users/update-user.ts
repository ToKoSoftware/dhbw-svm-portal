import { Request, Response } from 'express';
import isBlank from 'is-blank';
import { checkKeysAreNotEmptyOrNotSet } from '../../../functions/check-inputs.func';
import { mapUser } from '../../../functions/map-users.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { RawUserData } from '../../../interfaces/users.interface';
import { User } from '../../../models/user.model';
import * as EmailValidator from 'email-validator';
import { currentUserIsAdminOrMatchesId } from '../../../functions/current-user-is-admin-or-matches-id.func';
import { jwtSign } from '../../../functions/jwt-sign.func';
import { Op } from 'sequelize';

export async function updateUser(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawUserData = req.body;
    const mappedIncomingData: RawUserData = await mapUser(incomingData);

    const requiredFields = User.requiredFields();

    const validEmail = EmailValidator.validate(mappedIncomingData.email) || isBlank(mappedIncomingData.email);

    const validBirthday = mappedIncomingData.birthday instanceof Date || isBlank(mappedIncomingData.birthday);
    if (!validBirthday) {
        return res.status(400).send(wrapResponse(false, { error: 'Birthday is not valid' }));
    }

    if (mappedIncomingData.password !== undefined) {
        if (mappedIncomingData.password.length <= 5) {
            return res.status(400).send(wrapResponse(false, { error: 'Password not valid! It must contain at least 6 characters!' }));
        }
    }

    if (isBlank(req.body) || req.params.id === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No body or valid param set.' }));
    }

    if (!currentUserIsAdminOrMatchesId(req.params.id)) {
        return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
    }

    const user: User | null = await User.findByPk(req.params.id)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    //User object from database must not be null, id must not be changed and all set keys must not be empty.
    if (
        user !== null
        && checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) !== false
        && validEmail
    ) {

        //email should be changed: check if already in use
        if (user.email !== mappedIncomingData.email && mappedIncomingData.email !== undefined) {
            const emailInUseCount = await User.count({
                where: {
                    id: {
                        [Op.ne]: user.id
                    },
                    email: mappedIncomingData.email
                }
            })
                .catch(() => {
                    success = false;
                    return 0;
                });
            if (!success) {
                return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
            }
            if (emailInUseCount > 0) {
                return res.status(400).send(wrapResponse(false, { error: 'E-Mail already in use' }));
            }
        }

        //username should be changed: check if already in use
        if (user.username !== mappedIncomingData.username && mappedIncomingData.username !== undefined) {
            const usernameInUseCount = await User.count({
                where: {
                    id: {
                        [Op.ne]: user.id
                    },
                    username: mappedIncomingData.username
                }
            })
                .catch(() => {
                    success = false;
                    return 0;
                });
            if (!success) {
                return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
            }
            if (usernameInUseCount > 0) {
                return res.status(400).send(wrapResponse(false, { error: 'Username already in use' }));
            }
        }

        user.update(mappedIncomingData)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        if (user === null) {
            return res.send(wrapResponse(true, { info: 'No user updated' }));
        }

    } else if (user === null) {
        return res.status(404).send(wrapResponse(false, { error: 'No user with given id found' }));

    } else if (checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) === false) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));

    } else if (validEmail === false) {
        return res.status(400).send(wrapResponse(false, { error: 'E-mail is not valid' }));

    } else {
        return res.status(400).send(wrapResponse(false));
    }

    const token = jwtSign(user);

    return res.send(wrapResponse(true, { user: user, jwt: token }));
}
