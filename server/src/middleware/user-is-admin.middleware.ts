import { NextFunction, Request, Response } from 'express';
import { Vars } from '../vars';
import { CustomError } from './error-handler';
import { PortalErrors } from '../enum/errors';

export function userIsAdmin(req: Request, res: Response, next: NextFunction): void {
    try {
        if (Vars.currentUserIsAdmin) next();
        next(new CustomError(PortalErrors.PERMISSION_DENIED, 403));
    }
    catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}
