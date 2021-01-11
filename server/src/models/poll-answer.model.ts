import {sequelizeInstance} from '../bootstrap/connect-db.func';
import {Model, DataType} from 'sequelize-typescript';
import { PollAnswerData } from '../interfaces/poll-answer.interface';
import Poll from './poll.model';

const config = {
    tableName: 'PollAnswers',
    sequelize: sequelizeInstance,
};

class PollAnswer extends Model {
    id: string;
    title: string;
    is_active: boolean;

    public static requiredFields(): Array<keyof PollAnswerData> {
        return [
            'title',
        ];
    }
}
PollAnswer.init(
    {
        id: {
            primaryKey: true,
            allowNull: false,
            type: DataType.UUID,
            defaultValue: DataType.UUIDV4
        },
        title: {
            type: DataType.STRING,
            allowNull: false
        },
        is_active: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: true
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

PollAnswer.belongsTo(Poll);

export default PollAnswer;