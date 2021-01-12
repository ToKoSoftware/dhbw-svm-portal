import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from 'sequelize-typescript';
import { PollData } from '../interfaces/poll.interface';
import { Organization } from './organization.model';
import { PollAnswer } from './poll-answer.model';
import { User } from './user.model';

@Table
export class Poll extends Model {

    @Column
    title: string;
    @Column
    body: string;
    @Column
    closes_at: Date;
    @Column
    is_active: boolean;
    @ForeignKey(() => User)
    @Column
    author_id: string;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;

    @BelongsTo(() => User)
    author: User;
    @BelongsTo(() => Organization)
    organization: Organization;

    @HasMany(() => PollAnswer)
    poll_answers: PollAnswer[];

    public static requiredFields(): Array<keyof PollData> {
        return [
            'title',
            'body',
            'closes_at'
        ];
    }
}
/**
 * TODO
 * Poll.belongsTo(Team);
 */