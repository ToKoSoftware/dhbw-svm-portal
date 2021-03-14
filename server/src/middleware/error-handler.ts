import {NextFunction, Request, Response} from 'express';
import {PortalErrors} from '../enum/errors';
import {wrapResponse} from '../functions/response-wrapper';
import {PortalErrorData} from '../interfaces/error-handler-interface';
import {Vars} from '../vars';


export class CustomError extends Error {
    constructor(public errorEnumMessage: PortalErrors, public statusCode: number) {
        super();
    }
}

type IErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => unknown;


export const errorHandler: IErrorHandler = (err, req, res,) => {
    if (!err) return;
    let error: PortalErrorData;
    if (err.name === 'CustomError') {
        error = {
            success: false,
            message: err?.errorEnumMessage.toString() || 'Es ist ein Fehler aufgetreten',
            status: err?.statusCode || 500,
            type: PortalErrors[err.errorEnumMessage].toString(),
        };
    } else {
        error = {
            success: false,
            message: 'Es ist ein Fehler aufgetreten',
            status: 500,
            type: 'INTERNAL_SERVER_ERROR',
        };
    }
    if (Vars.config.logging) error.stacktrace = err.stack?.split('\n    ');


    res.status(error.status).send(wrapResponse(false, error));
};



