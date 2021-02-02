import { Request, Response } from 'express';
import { wrapResponse } from '../../../functions/response-wrapper';

export async function updateEvent(req: Request, res: Response): Promise<Response> {
    

    return res.send(wrapResponse(true, {}));
}