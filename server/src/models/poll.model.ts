import {BelongsTo, Column, DefaultScope, ForeignKey, HasMany, IsDate, Model, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import { RawPollData } from '../interfaces/poll.interface';
import { Organization } from './organization.model';
import { PollAnswer } from './poll-answer.model';
import { Team } from './team.model';
import { User } from './user.model';
import {Op} from 'sequelize';
import { currentOrg } from './current-org.scope';

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
    active: {
        required: false,
        where: {
            is_active: true
        }
    },
    inactive: {
        required: false,
        where: {
            is_active: false
        }
    },
    expired: (date: Date) => ({
        required: false,
        where: {
            closes_at: {
                [Op.lte]: date
            }
        }
    }),
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id)
})) 


@Table
export class Poll extends Model {

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