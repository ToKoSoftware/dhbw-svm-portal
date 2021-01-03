import {Configuration, DatabaseCredentials} from '../interfaces/configutation.interface';
import {Vars} from '../vars';
import isBlank from 'is-blank';

export function loadConfig(): Configuration {
    const loggingEnabled = process.env.LOGGING === 'true';
    Vars.loggy.loggingEnabled = loggingEnabled;
    if (loggingEnabled) {
        Vars.loggy.warn('[Configuration Loader] Enabled config.logging because the LOGGING env variable is set to true');
    }
    const databaseCredentialFields: ConfigurationConfig[] = [
        {
            name: 'DATABASE_URL',
            mappingName: 'url',
            required: true
        }, {
            name: 'DATABASE_NAME',
            mappingName: 'dbname',
            required: true
        }, {
            name: 'DATABASE_USER',
            mappingName: 'username',
            required: true
        }, {
            name: 'DATABASE_PASSWORD',
            mappingName: 'password',
            required: true
        }, {
            name: 'DATABASE_PORT',
            mappingName: 'port',
            defaultValue: '5432',
            required: false
        }, {
            name: 'JWT_HASH',
            mappingName: 'jwtSalt',
            defaultValue: '',
            required: true
        },
    ];

    const mappedDatabaseCredentials: DatabaseCredentials = {
        dbname: '',
        password: '',
        username: '',
        url: '',
        port: '',
        jwtSalt: ''
    };

    databaseCredentialFields.forEach((field) => {
        if (process.env[field.name] != undefined && process.env[field.name] != null && !isBlank(process.env[field.name])) {
            mappedDatabaseCredentials[field.mappingName] = process.env[field.name] || '';
        } else if (!field.required && !isBlank(field.defaultValue)) {
            mappedDatabaseCredentials[field.mappingName] = field.defaultValue || '';
        } else {
            Vars.loggy.error(`[Configuration Loader] Database Environment Variable ${field.name} is missing`);
            process.abort();
        }
    });

    return {
        logging: loggingEnabled,
        database: mappedDatabaseCredentials
    };
}

interface ConfigurationConfig {
    name: string;
    mappingName: allowedMappedValues;
    defaultValue?: string;
    required: boolean;
}

export type allowedMappedValues = keyof DatabaseCredentials;
