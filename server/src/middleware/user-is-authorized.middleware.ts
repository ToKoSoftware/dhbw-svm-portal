import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../enum/errors';
import { verifyToken } from '../functions/verify-token.func';
import { CustomError } from './error-handler';

export async function userIsAuthorized(req: Request, res: Response, next: NextFunction): Promise<void> {
    const header = req.headers.authorization;
    if (header !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [ bearer, token ] = header.split(' ');
        verifyToken(res, token, next);
    } else {
        next(new CustomError(PortalErrors.UNAUTHORIZED, 401));
    }
}
