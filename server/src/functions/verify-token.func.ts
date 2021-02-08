import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Vars } from '../vars';
import { wrapResponse } from './response-wrapper';
import { userIsAdminCheck } from './user-is-admin-check.func';

export function verifyToken(res: Response, token: string, next: NextFunction): void {
    jwt.verify(token, Vars.config.database.jwtSalt, async (err: unknown) => {
        if (err) {
            res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
        } else {
            Vars.currentJWT = token;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const userData: string | { [key: string]: any; } | null = jwt.decode(token);
            if (!(userData instanceof Object) || userData === null) {
                return res.status(403).send(wrapResponse(false, { error: 'Error occured during authorization!' }));
            }
            const user = await User.scope('full').findOne({
                where: {
                    id: userData.id
                }
            });

            if (user === null) {
                return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
            }
            // check if any of the user's roles are the current user's organisation's admin role
            Vars.currentUserIsAdmin = userIsAdminCheck(user);
            Vars.currentUser = user;
            Vars.currentOrganization = user.organization;
            next();
        }
    });
}
