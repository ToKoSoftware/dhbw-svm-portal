import {Sequelize} from 'sequelize-typescript';
import {Vars} from '../vars';
import {Op} from 'sequelize';

export function connectToDatabase(): void {
    try {
        sequelizeInstance.authenticate().then(
            () => Vars.loggy.info('Connection has been established successfully.')
        );
        sequelizeInstance.sync(); //You can use sequelize.sync() to automatically synchronize all models.
        Vars.db = sequelizeInstance;
        Vars.op = Op;
    } catch (error) {
        Vars.loggy.error('Unable to connect to the database:', error);
    }
}

export const sequelizeInstance = new Sequelize(
    `postgres://${Vars.config.database.username}:${Vars.config.database.password}@${Vars.config.database.url}:${Vars.config.database.port}/${Vars.config.database.dbname}`
);