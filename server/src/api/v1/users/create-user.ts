import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { User } from '../../../models/user.model';
import { Op } from 'sequelize';
import { mapUser } from '../../../functions/map-users.func';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import * as EmailValidator from 'email-validator';
import { UserDataSnapshot, UserRegistrationData } from '../../../interfaces/users.interface';
import { Organization } from '../../../models/organization.model';
import { Vars } from '../../../vars';

export async function createUser(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: UserRegistrationData = req.body;
    let access_code = '';
    if (incomingData.access_code !== undefined) {
        access_code = incomingData.access_code;
        delete incomingData.access_code;
    }
    const incomingDataWithoutAccessCode: UserDataSnapshot = incomingData;
    const mappedIncomingData: UserDataSnapshot = await mapUser(incomingDataWithoutAccessCode);

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

    if (mappedIncomingData.password !== undefined) {
        if (mappedIncomingData.password.length <= 5) {
            return res.status(400).send(wrapResponse(false, { error: 'Password not valid! It must contain at least 6 characters!' }));
        }
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

        const org: Organization | null = await Organization.findOne(
            {
                where: {
                    access_code: access_code
                }
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }
        
        const org_id = org ? org.id : null;

        const createdData = await User.create(
            {
                ...mappedIncomingData,
                org_id: org_id
            })
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
