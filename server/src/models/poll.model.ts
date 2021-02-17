import {
    BeforeCreate, BelongsTo, Column, DefaultScope, ForeignKey, HasMany, IsDate,
    NotEmpty, PrimaryKey, Scopes, Table
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { RawPollData } from '../interfaces/poll.interface';
import { Organization } from './organization.model';
import { PollAnswer } from './poll-answer.model';
import { Team } from './team.model';
import { User } from './user.model';
import { Op } from 'sequelize';
import { currentOrg } from './current-org.scope';
import { LoggedModel } from './logged.model';

@DefaultScope(() => ({
    required: false,
    where: {
        is_active: true
    },
    order: [ [ 'closes_at', 'ASC' ] ]
}))
@Scopes(() => ({
    full: {
        include: [ Organization, User, Team, PollAnswer ]
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
                [ Op.lte ]: date
            }
        }
    }),
    notExpired: (date: Date) => ({
        required: false,
        where: {
            closes_at: {
                [ Op.gte ]: date
            }
        }
    }),
    ordered: {
        required: false,
        order: [ [ 'closes_at', 'ASC' ] ]
    },
    onlyAnswerTeam: (teamId: string, publicTeamId: string) => ({
        required: false,
        where: {
            [ Op.or ]: [
                {
                    answer_team_id: teamId
                },
                {
                    answer_team_id: publicTeamId
                }
            ]
        }
    }),
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id)
}))


@Table
export class Poll extends LoggedModel {

    public static modelName = 'Poll';
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @Column
    body: string; // 5000 chars long
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

    @BeforeCreate
    static addUuid(instance: Poll): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawPollData> {
        return [
            'title',
            'body',
            'closes_at',
            'answer_team_id',
            'is_active'
        ];
    }
}