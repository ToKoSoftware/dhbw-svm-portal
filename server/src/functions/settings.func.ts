import {Vars} from '../vars';
import {Organization} from '../models/organization.model';

export async function updateOrgSetting<T>(key: string, value: SingleConfiguration<T>): Promise<OrganizationConfiguration | null> {
    const currentOrg: Organization | null = await Organization.scope('full').findByPk(Vars.currentOrganization.id)
        .then(org => org)
        .catch(() => null);
    if (!currentOrg) {
        return null;
    }
    const configData: OrganizationConfiguration = currentOrg.config as unknown as OrganizationConfiguration;
    configData[key] = value;
    currentOrg.config = JSON.stringify(configData);
    return await currentOrg.save()
        .then(() => configData)
        .catch(() => null);
}

export async function loadOrgSetting<T>(key: string): Promise<SingleConfiguration<T> | null> {
    const currentOrg: Organization | null = await Organization.scope('full').findByPk(Vars.currentOrganization.id)
        .then(org => org)
        .catch(() => null);
    if (!currentOrg) {
        return null;
    }
    const configData: unknown | null = currentOrg?.config as unknown || null;
    if (!configData && typeof configData !== 'object' && !Array.isArray(configData)) {
        return null;
    }
    return Object.keys(configData as OrganizationConfiguration).includes(key)
        ? (configData as OrganizationConfiguration)[key] as SingleConfiguration<T>
        : null;
}

export type OrganizationConfiguration = { [key: string]: SingleConfiguration<unknown> }

export interface SingleConfiguration<T> {
    data: T;
    protection: ConfigProtectionType[];
}

export type ConfigProtectionType = 'system' | 'admin' | 'login' | 'public';
