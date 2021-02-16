import { NextFunction, Request, Response } from 'express';
import { Vars } from '../vars';
import { customError } from './error-handler';
import Errors from '../enum/errors';

export function userIsAdmin(req: Request, res: Response, next: NextFunction): void {
    if (Vars.currentUserIsAdmin) {
        next();
    } else {
        next(new customError(Errors.PERMISSION_DENIED, 403));

        //res.status(403).send(wrapResponse(false, { error: 'Permission denied!' }));
        return;
    }
}
