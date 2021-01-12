import {Model, Table, Column, ForeignKey, BelongsTo} from 'sequelize-typescript';
import { PollAnswerData } from '../interfaces/poll-answer.interface';
import { Poll } from './poll.model';

@Table
export class PollAnswer extends Model {
    
    @Column
    title: string;
    @Column
    is_active: boolean;
    @ForeignKey(() => Poll)
    @Column
    poll_id: string;

    @BelongsTo(() => Poll)
    poll: Poll;

    public static requiredFields(): Array<keyof PollAnswerData> {
        return [
            'title',
        ];
    }
}