import {NextFunction, Request, Response} from 'express';
import {wrapResponse} from '../functions/response-wrapper';
import {verifyToken} from '../functions/verify-token.func';

export async function userIsAuthorizedByParam(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.query.token?.toString();
    if (token !== '' && token !== undefined) {
        verifyToken(res, token, next);
    } else {
        res.status(401).send(wrapResponse(false, {error: 'Unauthorized!'}));
    }
}
