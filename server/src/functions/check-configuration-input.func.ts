import {availableConfigurationKey, OrganizationConfiguration, SingleConfiguration} from './settings.func';
import {checkKeysAreNotEmptyOrNotSet} from './check-inputs.func';
import validateColor from 'validate-color';


export function checkConfigUpdateInput(config: OrganizationConfiguration): boolean {
    if (Array.isArray(config) || typeof config !== 'object') {
        return false;
    }
    const keys: availableConfigurationKey[] = Object.keys(config) as availableConfigurationKey[];
    return keys.every(key => {
        switch (key) {
        case 'colors':
            return false; // checkColorConfig(config[key]);
        case 'oauth2':
            return false; // these configurations have their own api; we might move this here later
        case 'ftp':
            return false;
        }
    });
}

export function checkColorConfig(config: OrganizationColorConfiguration): boolean {
    const fields = [
        'titleBarBackgroundColor',
        'titleBarBorderColor',
        'titleBarTextColor',
        'sidebarLinkTextColor',
        'accentColor'
    ];
    if (!checkKeysAreNotEmptyOrNotSet(config, fields)) {
        return false;
    }
    const f = fields.every((f) => {
        const color: string | null = config[f as availableColors] || null;
        const v = color === null? true : validateColor(color);
        return v;
    });
    return f;
}

export type availableColors =
    'titleBarBackgroundColor'
    | 'titleBarBorderColor'
    | 'titleBarTextColor'
    | 'sidebarLinkTextColor'
    | 'accentColor';
export type OrganizationColorConfiguration = { [k in availableColors]: string; }

type requestStatus = 'REQUEST' | 'SUCCESS' | 'FAILURE'
type requestTypes = { [key in requestStatus]?: string }
