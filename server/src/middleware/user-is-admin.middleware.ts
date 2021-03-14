import { NextFunction, Request, Response } from 'express';
import { Vars } from '../vars';
import { CustomError } from './error-handler';
import { PortalErrors } from '../enum/errors';

export function userIsAdmin(req: Request, res: Response, next: NextFunction): void {
    if (Vars.currentUserIsAdmin) {
        next();
    } else {
        next(new CustomError(PortalErrors.PERMISSION_DENIED, 403));

        //res.status(403).send(wrapResponse(false, { error: 'Permission denied!' }));
        return;
    }
}
