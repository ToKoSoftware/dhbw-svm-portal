import { NextFunction, Request, Response } from 'express';
import { ErrorHandlerInterface } from '../interfaces/error-handler-interface';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  const error: ErrorHandlerInterface = {
    message: err.message || 'Es ist ein Fehler aufgetreten',
    status: 500,
    errorMsg: err.stack || '',
  };

  res.status(error.status).send(error);
}