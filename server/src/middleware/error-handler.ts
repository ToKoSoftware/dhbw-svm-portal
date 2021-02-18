import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../enum/errors';
import { wrapResponse } from '../functions/response-wrapper';
import { PortalErrorData } from '../interfaces/error-handler-interface';
import { Vars } from '../vars';


export class customError extends Error {
    constructor(public errorEnumMessage: PortalErrors, public statusCode: number) {
        super();
    }
}

type IErrorHandler = (err: customError, req: Request, res: Response, next: NextFunction) => unknown;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: IErrorHandler = (err, req, res, next) => {
    const error: PortalErrorData = {
        message: err.errorEnumMessage.toString() || 'Es ist ein Fehler aufgetreten',
        status: err.statusCode || 500,
        type: PortalErrors[ err.errorEnumMessage ].toString(),
        success: false,
    };

    if (Vars.config.logging) error.stacktrace = err.stack?.split('\n    ');

    res.status(error.status).send(wrapResponse(false, error));
};



