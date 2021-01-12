import {BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table} from 'sequelize-typescript';
import { RawPollData } from '../interfaces/poll.interface';
import { Organization } from './organization.model';
import { PollAnswer } from './poll-answer.model';
import { Team } from './team.model';
import { User } from './user.model';

@Table
export class Poll extends Model {

    @PrimaryKey
    @Column
    id: string;
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
    @ForeignKey(() => Team)
    @Column
    answer_team_id: string;

    @BelongsTo(() => User)
    author: User;
    @BelongsTo(() => Organization)
    organization: Organization;
    @BelongsTo(() => Team)
    answer_team: Team;

    @HasMany(() => PollAnswer)
    poll_answers: PollAnswer[];

    public static requiredFields(): Array<keyof RawPollData> {
        return [
            'title',
            'body',
            'closes_at'
        ];
    }
}