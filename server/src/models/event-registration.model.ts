import {sequelizeInstance} from '../bootstrap/connect-db.func';
import {Model, DataType} from 'sequelize-typescript';
import User from './user.model';
import Event from './event.model';

const config = {
    tableName: 'EventRegistrations',
    sequelize: sequelizeInstance,
};

class EventRegistration extends Model {
    id: string;
    user_id: string;
    event_id: string;
    body: string;
    payment_done: boolean;
}
EventRegistration.init(
    {
        id: {
            primaryKey: true,
            allowNull: false,
            type: DataType.UUID,
            defaultValue: DataType.UUIDV4
        },
        user_id: {
            type: DataType.UUID,
            references: {
                model: User,
                key: 'id'
            }
        },
        event_id: {
            type: DataType.UUID,
            references: {
                model: Event,
                key: 'id'
            }
        },
        body: {
            type: DataType.STRING,
            allowNull: true
        },
        payment_done: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt: {
            allowNull: false,
            type: DataType.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataType.DATE
        }
    },
    config,
);
User.belongsToMany(Event, {through: EventRegistration});
Event.belongsToMany(User, {through: EventRegistration});

export default EventRegistration;