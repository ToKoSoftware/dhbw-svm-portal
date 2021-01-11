import {Sequelize} from 'sequelize-typescript';
import {Vars} from '../vars';
import {User} from '../models/user.model';
import { Organization } from '../models/organization.model';

export function connectToDatabase(): void {
    try {
        const sequelize = new Sequelize({
            username: Vars.config.database.username,
            password: Vars.config.database.password,
            database: Vars.config.database.dbname,
            host: Vars.config.database.url,
            port: Number(Vars.config.database.port),
            dialect: 'postgres',
            models: [User, Organization]
        });
        
        sequelize.authenticate().then(
            () => Vars.loggy.info('Connection has been established successfully.')
        );
    } catch (error) {
        Vars.loggy.error('Unable to connect to the database:', error);
    }
}