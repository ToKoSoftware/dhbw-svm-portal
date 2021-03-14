import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Form} from '../../../models/form.model';
import {Vars} from '../../../vars';

export async function getForms(req: Request, res: Response): Promise<Response> {
    const forms = await Form.scope({method: ['onlyCurrentOrg', Vars.currentOrganization.id]}).findAll();
    return res.send(wrapResponse(false, forms));
}

export async function getForm(req: Request, res: Response): Promise<Response> {
    const form = await Form.scope({method: ['onlyCurrentOrg', Vars.currentOrganization.id]}).findByPk(req.params.id);
    return res.send(wrapResponse(false, form));
}
