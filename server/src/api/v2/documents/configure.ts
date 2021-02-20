import { NextFunction, Request, Response } from 'express';
import { loadOrgSetting, updateOrgSetting } from '../../../functions/settings.func';
import { wrapResponse } from '../../../functions/response-wrapper';
import { objectHasRequiredAndNotEmptyKeys } from '../../../functions/check-inputs.func';
import { CustomError } from '../../../middleware/error-handler';
import { PortalErrors } from '../../../enum/errors';

export async function getFTPConfiguration(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const config = await loadOrgSetting<FTPClientConfiguration>('ftp');
        if (!config) {
            await createDefaultFTPConfig();
            // reload data
            return getFTPConfiguration(req, res, next);
        }
        const d = { ...config.data };
        return res.send(wrapResponse(true, d));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}

export async function updateFTPConfiguration(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        const fields = [ 'password', 'user', 'host' ];
        if (!objectHasRequiredAndNotEmptyKeys(req.body, fields)) {
            return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));
        }
        const updatedConfig = await updateOrgSetting<FTPClientConfiguration>('ftp',
            {
                data: {
                    password: req.body.password,
                    host: req.body.host,
                    user: req.body.user
                },
                protection: [ 'system', 'admin' ]
            }
        );
        if (!updatedConfig) {
            return res.status(500).send(wrapResponse(false, { error: 'Database error.' }));
        }
        return res.send(wrapResponse(true, req.body));
    } catch (error) {
        next(new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error));
    }
}

async function createDefaultFTPConfig(): Promise<void> {
    try {
        await updateOrgSetting<FTPClientConfiguration>('ftp',
            {
                data: {
                    password: Math.random().toString(36).substring(7),
                    host: 'example.com',
                    user: 'example',
                    enabled: false
                },
                protection: [ 'system', 'admin' ]
            }
        );
    } catch (error) {
        throw new CustomError(PortalErrors.INTERNAL_SERVER_ERROR, 500, error);
    }
}

export interface FTPClientConfiguration {
    password: string;
    host: string;
    user: string;
    enabled?: boolean;
}
