import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Form} from '../../../models/form.model';
import {Vars} from '../../../vars';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/check-inputs.func';

export async function createForm(req: Request, res: Response): Promise<Response> {

    const requiredFields = Form.requiredFields();

    if (!objectHasRequiredAndNotEmptyKeys(req.body, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Not all required fields have been set' }));
    }
    const formData = req.body;
    const formConfig = req.body.config;
    if (!validateSchema(formConfig)) {
        return res.status(400).send(wrapResponse(false,
            { error: 'Not all required fields have been set or the json schema is not correct' }));
    }
    const form = await Form.create({
        title: formData.title,
        description: formData.description,
        allowed_team_id: null,
        author_id: Vars.currentUser.id,
        org_id: Vars.currentOrganization.id,
        config: JSON.stringify(formConfig)
    });
    return res.status(403).send(wrapResponse(true, form));
}

function validateSchema(json: unknown): boolean {
    if (!Array.isArray(json)) {
        return false;
    }
    const schema: FormSchemaField[] = json;
    const availableTypes = ['checkbox', 'markdown', 'number', 'select', 'text'];
    const requiredFields: Array<keyof FormSchemaField> = ['label', 'required', 'id', 'type',];
    const ids = [];
    for (const formItem of schema) {
        if (!availableTypes.includes(formItem.type)) {
            return false;
        }
        if (!objectHasRequiredAndNotEmptyKeys(formItem, requiredFields)) {
            return false;
        }
        ids.push(formItem.id);
    }
    return arrayIsUnique(ids);
}

function arrayIsUnique(values: string[]) : boolean {
    return !values.some((val, i) => values.indexOf(val) !== i);
}

export interface FormSchemaMetaData {
    label: string;
    description: string;
    id: string;
    required: boolean;
    type: string;
}

export interface TextFormSchema extends FormSchemaMetaData {
    type: 'text';
    defaultValue: string;
}

export interface NumberFormSchema extends FormSchemaMetaData {
    type: 'number';
    defaultValue: string;
}

export interface MarkdownFormSchema extends FormSchemaMetaData {
    type: 'markdown';
    defaultValue: string;
}

export interface CheckboxFormSchema extends FormSchemaMetaData {
    type: 'checkbox';
    defaultValue: boolean;
}

export interface SelectFormSchema extends FormSchemaMetaData {
    type: 'select';
    options: SelectOption[],
    defaultValue: keyof SelectOption;
}

export interface SelectOption {
    [s: string]: string
}

export type FormSchemaField = TextFormSchema | NumberFormSchema | MarkdownFormSchema | SelectFormSchema | CheckboxFormSchema;
