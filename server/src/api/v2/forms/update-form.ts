import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Form} from '../../../models/form.model';

export async function updateForm(req: Request, res: Response): Promise<Response> {
    return res.status(403).send(wrapResponse(false, { error: '' }));
}
