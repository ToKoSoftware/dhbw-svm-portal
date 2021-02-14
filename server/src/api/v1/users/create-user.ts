import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';
import { User } from '../../../models/user.model';
import { Op } from 'sequelize';
import { mapUser } from '../../../functions/map-users.func';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import * as EmailValidator from 'email-validator';
import { UserDataSnapshot, UserRegistrationData } from '../../../interfaces/users.interface';
import { Organization } from '../../../models/organization.model';
import { RoleAssignment } from '../../../models/role-assignment.model';
import { Role } from '../../../models/role.model';
import { Vars } from '../../../vars';

export async function createUser(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: UserRegistrationData = req.body;
    let access_code = '';
    let accepted_privacy_policy = false;
    if (incomingData.access_code !== undefined) {
        access_code = incomingData.access_code;
        delete incomingData.access_code;
    }
    if (incomingData.accepted_privacy_policy !== undefined) {
        accepted_privacy_policy = incomingData.accepted_privacy_policy;
        delete incomingData.accepted_privacy_policy;
    }

    const incomingDataWithoutAccessCodeAndAcceptedPrivacyPolicy: UserDataSnapshot = incomingData;
    const mappedIncomingData: UserDataSnapshot = await mapUser(incomingDataWithoutAccessCodeAndAcceptedPrivacyPolicy);

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

        const org: Organization | null = await Organization.scope('full').findOne(
            {
                where: {
                    access_code: access_code
                }
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
        }

        const org_id = org ? org.id : null;

        if (org !== null && !accepted_privacy_policy) {
            return res.status(400).send(wrapResponse(false, { error: 'No acception of privacy policy' }));
        }

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
        const adminRoleId = org?.admin_role.id;
        if (adminRoleId) {
            const adminRole: Role[] = await Role.scope('full').findAll({
                where: {
                    id: adminRoleId
                }
            })
                .catch(() => {
                    success = false;
                    return [];
                });
            if (!success) {
                return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
            }
            const hasAdmin = adminRole[0].users.length;
            if (!hasAdmin) {
                await RoleAssignment.scope('full').create(
                    {
                        user_id: createdData.id,
                        role_id: org?.admin_role_id
                    })
                    .catch(() => {
                        success = false;
                        return null;
                    });
                if (!success) {
                    return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
                }
            }
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
