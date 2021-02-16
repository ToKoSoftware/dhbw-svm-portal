import {Request, Response} from 'express';
import {loadOrgSetting, updateOrgSetting} from '../../../functions/settings.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {objectHasRequiredAndNotEmptyKeys} from '../../../functions/check-inputs.func';

export async function getFTPConfiguration(req: Request, res: Response): Promise<Response> {
    const config = await loadOrgSetting<FTPClientConfiguration>('ftp');
    if (!config) {
        await createDefaultFTPConfig();
        // reload data
        return getFTPConfiguration(req, res);
    }
    const d = {...config.data};
    return res.send(wrapResponse(true, d));
}

export async function updateFTPConfiguration(req: Request, res: Response): Promise<Response> {
    const fields = ['password', 'user', 'host'];
    if (!objectHasRequiredAndNotEmptyKeys(req.body, fields)) {
        return res.status(400).send(wrapResponse(false, {error: 'Fields must not be empty'}));
    }
    const updatedConfig = await updateOrgSetting<FTPClientConfiguration>('ftp',
        {
            data: {
                password: req.body.password,
                host: req.body.host,
                user: req.body.user
            },
            protection: ['system', 'admin']
        }
    );
    if (!updatedConfig) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error.'}));
    }
    return res.send(wrapResponse(true, req.body));
}

async function createDefaultFTPConfig(): Promise<void> {
    await updateOrgSetting<FTPClientConfiguration>('ftp',
        {
            data: {
                password: Math.random().toString(36).substring(7),
                host: 'example.com',
                user: 'example',
                enabled: false
            },
            protection: ['system', 'admin']
        }
    );
}

export interface FTPClientConfiguration {
    password: string;
    host: string;
    user: string;
    enabled?: boolean;
}
