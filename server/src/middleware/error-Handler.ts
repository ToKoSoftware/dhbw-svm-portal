import { NextFunction, Request, Response } from 'express';
import EErrors from '../enum/errors';
import { ErrorHandlerInterface } from '../interfaces/error-handler-interface';


export class customError extends Error {
    constructor(msg: EErrors, public statusCode: number) {
        super(msg);
    }
}

//'existence-check (?)' = err.stack?
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: customError, req: Request, res: Response, next: NextFunction): void {
    const error: ErrorHandlerInterface = {
        message: err.message || 'Es ist ein Fehler aufgetreten',
        status: err.statusCode || 500,
        errorMsg: err.stack?.split('\n    '),
        success: false,
    };

    res.status(error.status).send(error);
}