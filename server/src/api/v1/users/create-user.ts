import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { User } from '../../../models/user.model';
import { Op } from 'sequelize';
import { mapUser } from '../../../functions/map-users.func';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import * as EmailValidator from 'email-validator';
import { RawUserData } from '../../../interfaces/users.interface';

export async function createUser(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawUserData = req.body;
    const mappedIncomingData: RawUserData = await mapUser(incomingData);

    const requiredFields = User.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }
    const validEmail = EmailValidator.validate(mappedIncomingData.email);

    if (!validEmail) {
        return res.status(400).send(wrapResponse(false, { error: 'Email is not valid' }));
    }

    if (mappedIncomingData.birthday.toString() === 'Invalid Date') {
        return res.status(400).send(wrapResponse(false, { error: 'Birthday is not valid' }));
    }

    const validPassword = incomingData.password.length >= 6;
    if (!validPassword) {
        return res.status(400).send(wrapResponse(false, { error: 'Password not valid! It must contain at least 6 characters!' }));
    }

    const user = await User.findOne(
        {
            where: {
                [Op.or]: [
                    {
                        email: mappedIncomingData.email
                    },
                    {
                        username: mappedIncomingData.username
                    }
                ]
            }

        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    if (user === null) {

        const createdData = await User.create(mappedIncomingData)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success || createdData === null) {
            return res.status(500).send(wrapResponse(false, { error: 'Could not create User' }));
        }

        const user = await User.findByPk(createdData.id)
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        return res.status(201).send(wrapResponse(true, user));
    } else {
        return res.status(400).send(wrapResponse(false, { error: 'Email or username is already in use' }));
    }

}
