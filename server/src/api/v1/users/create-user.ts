import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { UserData } from '../../../interfaces/users.interface';
import {User} from '../../../models/user.model';
import { mapUser } from '../../../functions/map-users.func';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import * as EmailValidator from 'email-validator';

export async function createUser(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: UserData = req.body;
    const mappedIncomingData: UserData = await mapUser(incomingData);


    const requiredFields = User.requiredFields();
    if (!objectHasRequiredAndNotEmptyKeys(mappedIncomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }
    const validEmail = EmailValidator.validate(mappedIncomingData.email);

    if (!validEmail) {
        return res.status(400).send(wrapResponse(false, { error: 'E-mail is not valid' }));
    }

    const user = await User.findOne(
        {
            where: {
                email: mappedIncomingData.email
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
        if (!success||createdData === null) {
            return res.status(500).send(wrapResponse(false, { error: 'Could not create User' }));
        }
        //return everything beside password
        const user = await User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: createdData.id
            }
        })
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        return res.status(201).send(wrapResponse(true, user));
    } else {
        return res.status(400).send(wrapResponse(false, { error: 'Email is already in use' }));
    }

}
