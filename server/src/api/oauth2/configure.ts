import {Request, Response} from 'express';
import {loadOrgSetting, updateOrgSetting} from '../../functions/settings.func';
import {wrapResponse} from '../../functions/response-wrapper';
import {OAuth2ClientConfiguration} from './authenticate';
import {objectHasRequiredAndNotEmptyKeys} from '../../functions/check-inputs.func';

export async function getOauth2Configuration(req: Request, res: Response): Promise<Response> {
    const oauthConfig = await loadOrgSetting<OAuth2ClientConfiguration>('oauth2');
    if (!oauthConfig) {
        await createDefaultOAuth2Config();
        // reload data
        return getOauth2Configuration(req, res);
    }
    const d = {
        application_name: oauthConfig?.data.application_name || null,
        client_secret: oauthConfig?.data.client_secret || ''
    };
    return res.send(wrapResponse(true, d));
}

export async function updateOauth2Configuration(req: Request, res: Response): Promise<Response> {
    const fields = ['client_secret', 'application_name'];
    if (!objectHasRequiredAndNotEmptyKeys(req.body, fields)) {
        return res.status(400).send(wrapResponse(false, {error: 'Fields must not be empty'}));
    }
    const updatedConfig = await updateOrgSetting<OAuth2ClientConfiguration>('oauth2',
        {
            data: {client_secret: req.body.client_secret, application_name: req.body.application_name},
            protection: ['system', 'admin']
        }
    );
    if (!updatedConfig) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error.'}));
    }
    return res.send(wrapResponse(true, {
        application_name: req.body.application_name,
        client_secret: req.body.client_secret
    }));
}

async function createDefaultOAuth2Config(): Promise<void> {
    await updateOrgSetting<OAuth2ClientConfiguration>('oauth2',
        {
            data: {client_secret: Math.random().toString(36).substring(7), application_name: 'portal-application'},
            protection: ['system', 'admin']
        }
    );
}
