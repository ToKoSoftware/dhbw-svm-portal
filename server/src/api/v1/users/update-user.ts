import {Request, Response} from 'express';
import isBlank from 'is-blank';
import {checkKeysAreNotEmptyOrNotSet} from '../../../functions/check-inputs.func';
import {mapUser} from '../../../functions/map-users.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {RawUserData} from '../../../interfaces/users.interface';
import {User} from '../../../models/user.model';
import * as EmailValidator from 'email-validator';
import {currentUserIsAdminOrMatchesId} from '../../../functions/current-user-is-admin-or-matches-id.func';
import {Op} from 'sequelize';
import {jwtSign} from '../../../functions/jwt-sign.func';

export async function updateUser(req: Request, res: Response): Promise<Response> {
    let success = true;
    let updateResult: [number, User[]] | null;
    const incomingData: RawUserData = req.body;
    const mappedIncomingData: RawUserData = await mapUser(incomingData);

    const requiredFields = User.requiredFields();

    const validEmail = EmailValidator.validate(mappedIncomingData.email) || isBlank(mappedIncomingData.email);

    if (isBlank(req.body) || req.params.id === null) {
        return res.status(400).send(wrapResponse(false, {error: 'No body or valid param set.'}));
    }

    if (!currentUserIsAdminOrMatchesId(req.params.id)) {
        return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
    }

    const user: User | null = await User.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    //User object from database must not be null, id must not be changed and all set keys mut not be empty.
    if (
        user !== null
        && (req.body.id === undefined || req.params.id === req.body.id)
        && checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) !== false
        && validEmail
        && (req.body.is_admin === undefined)
    ) {
        let updateQuery;
        //If mail of found user does not match incoming mail check, if email already in use.
        if(user.email !== mappedIncomingData.email && mappedIncomingData.email !== undefined){
            const emailInUseCount = await User.count({
                where: {
                    email: mappedIncomingData.email,
                    id: {
                        [Op.ne]: user.id
                    }
                }
            })
                .catch(() => {
                    success = false;
                    return 0;
                });
            if (!success) {
                return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
            }
            if(emailInUseCount > 0){
                return res.status(400).send(wrapResponse(false, {error: 'E-Mail already in use'}));
            }
            // mail can be changed, so change complete user.
            updateQuery = mappedIncomingData.password === undefined ? {email: mappedIncomingData.email} : mappedIncomingData;
        } else {
            // mail should not be changed, so change only password (only changable field)
            updateQuery = { password: mappedIncomingData.password };
            
        }
        updateResult = await User.update(updateQuery,
            { 
                where: {
                    id: req.params.id
                },
                returning: true,
            })
            .catch(() => {
                success = false;
                return null;
            });
        if (!success) {
            return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
        }
        if (updateResult === null || updateResult[0] == 0) {
            return res.send(wrapResponse(true, {info: 'No user updated'}));
        }

    } else if (user === null) {
        return res.status(404).send(wrapResponse(false, {error: 'No user with given id found'}));

    } else if (checkKeysAreNotEmptyOrNotSet(mappedIncomingData, requiredFields) === false) {
        return res.status(400).send(wrapResponse(false, {error: 'Fields must not be empty'}));

    } else if (!(req.body.id === undefined || req.params.id === req.body.id)) {
        return res.status(400).send(wrapResponse(false, {error: 'ID must not be changed'}));

    } else if (validEmail === false) {
        return res.status(400).send(wrapResponse(false, {error: 'E-mail is not valid'}));

    } else if (req.body.is_admin !== undefined) {
        return res.status(400).send(wrapResponse(false, {error: 'is_admin can not be changed'}));

    } else {
        return res.status(400).send(wrapResponse(false));
    } 
    
    //return everything beside password
    const returnedUser = await User.findOne(
        {
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id
            }
        })
        .catch(() => {
            success = false;
            return null;
        });
 
    if (!success || returnedUser === null) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    const token = jwtSign(returnedUser);

    return res.send(wrapResponse(true, {user: returnedUser, jwt: token}));

}
