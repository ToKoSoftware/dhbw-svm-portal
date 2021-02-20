import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../enum/errors';
import { verifyToken } from '../functions/verify-token.func';
import { CustomError } from './error-handler';

export async function userIsAuthorizedByParam(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const token = req.query.token?.toString();
        if (token !== '' && token !== undefined) {
            verifyToken(res, token, next);
        } else {
            next(new CustomError(PortalErrors.UNAUTHORIZED, 401));
        }
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}
