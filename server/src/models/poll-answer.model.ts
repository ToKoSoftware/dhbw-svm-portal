import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {PollAnswerData} from '../interfaces/poll-answer.interface';

@Table
export class PollAnswer extends Model<PollAnswer> {

    @Column
    title: string;

    public static requiredFields(): Array<keyof PollAnswerData> {
        return [
            'title'
        ];
    }

    @BeforeCreate
    static addUuid(instance: PollAnswer): string {
        return instance.id = uuidv4();
    }
}