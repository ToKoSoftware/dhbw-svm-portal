import {Request, Response} from 'express';
import {checkKeysAreNotEmptyOrNotSet} from '../../../functions/check-inputs.func';
import {wrapResponse} from '../../../functions/response-wrapper';
import {RawOrganizationData} from '../../../interfaces/organization.interface';
import {Organization} from '../../../models/organization.model';
import {SingleConfiguration, updateOrgSetting} from '../../../functions/settings.func';
import {checkColorConfig, OrganizationColorConfiguration} from '../../../functions/check-configuration-input.func';

export async function updateOrganization(req: Request, res: Response): Promise<Response> {
    let success = true;
    const incomingData: RawOrganizationData = req.body;
    const organizationId = req.params.id;

    const organizationData: Organization | null = await Organization.scope('full').findByPk(organizationId)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (organizationData === null) {
        return res.status(400).send(wrapResponse(false, { error: 'No Organization with given id found' }));
    }

    const requiredFields = Organization.requiredFields();
    if (!checkKeysAreNotEmptyOrNotSet(incomingData, requiredFields)) {
        return res.status(400).send(wrapResponse(false, { error: 'Fields must not be empty' }));
    }

    if (incomingData.access_code !== undefined) {
        const foundOrg = await Organization.findOne(
            {
                where: {
                    access_code: incomingData.access_code
                }
            }).catch(() => null);
        if (foundOrg){
            return res.status(400).send(wrapResponse(false, { error: 'Invalid access_code!' }));
        }
    }

    organizationData.update(incomingData)
        .catch(() => {
            success = false;
            return null;
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }
    if (organizationData === null) {
        return res.send(wrapResponse(true, {info: 'Nothing updated'}));
    }

    return res.send(wrapResponse(true, organizationData));
}

export async function updateOrganizationConfiguration(req: Request, res: Response): Promise<Response> {
    const updateConfig = req.body;
    const attemptedConfig: SingleConfiguration<OrganizationColorConfiguration> = {
        data: updateConfig,
        protection: ['login']
    };
    if (!checkColorConfig(updateConfig)) {
        return res.status(400).send(wrapResponse(false, {error: 'Wrong format'}));
    }

    const updatedConfig = await updateOrgSetting<OrganizationColorConfiguration>('colors', attemptedConfig);
    if (!updatedConfig) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error.'}));
    }
    return res.send(wrapResponse(true, req.body));
}
