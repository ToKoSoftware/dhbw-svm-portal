import { NextFunction, Request, Response } from 'express';
import { PortalErrors } from '../enum/errors';
import { PortalErrorData } from '../interfaces/error-handler-interface';


export class customError extends Error {
    constructor(public errorEnumMessage: PortalErrors, public statusCode: number) {
        super(/*errorEnumMessage*/);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: customError, req: Request, res: Response, next: NextFunction): void {
    const error: PortalErrorData = {
        message: err.errorEnumMessage.toString() || 'Es ist ein Fehler aufgetreten',
        status: err.statusCode || 500,
        type: PortalErrors[ err.errorEnumMessage ].toString(),
        stacktrace: err.stack?.split('\n    '),
        success: false,
    };

    res.status(error.status).send(error);
}
