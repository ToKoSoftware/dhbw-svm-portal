import {BelongsTo, Column, DefaultScope, ForeignKey, HasMany, IsDate, IsUUID, Model, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import { PollData } from '../interfaces/poll.interface';
import { Organization } from './organization.model';
import { PollAnswer } from './poll-answer.model';
import { Team } from './team.model';
import { User } from './user.model';

@DefaultScope(() => ({
    required: false,
    where: {
        is_active: true
    }
}))
@Scopes(() => ({
    full: {
        include: [Organization, User, Team, PollAnswer]
    },
    fullAndActive: {
        required: false,
        include: [Organization, User, Team, PollAnswer],
        where: {
            is_active: true
        }
    },
    expired: {
        required: false,
        where: {
            is_active: false  
        }
    }
})) 


@Table
export class Poll extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @Column
    body: string;
    @IsDate
    @Column
    closes_at: Date;
    @Column
    is_active: boolean;
    @IsUUID(4)
    @ForeignKey(() => User)
    @Column
    author_id: string;
    @IsUUID(4)
    @ForeignKey(() => Organization)
    @Column
    org_id: string;
    @IsUUID(4)
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

    public static requiredFields(): Array<keyof PollData> {
        return [
            'title',
            'body',
            'closes_at'
        ];
    }
}