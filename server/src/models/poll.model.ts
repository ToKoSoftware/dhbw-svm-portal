import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {PollData} from '../interfaces/poll.interface';

@Table
export class Poll extends Model<Poll> {

    @Column
    title: string;
    @Column
    body: string;
    @Column
    closes_at: Date;
    @Column
    is_active: boolean;

    public static requiredFields(): Array<keyof PollData> {
        return [
            'title',
            'body',
            'closes_at'
        ];
    }

    @BeforeCreate
    static addUuid(instance: Poll): string {
        return instance.id = uuidv4();
    }
}