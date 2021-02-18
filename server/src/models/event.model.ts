import { AllowNull, BeforeCreate, BelongsTo, BelongsToMany, Column, DefaultScope, ForeignKey, IsDate, IsInt, NotEmpty, PrimaryKey, Scopes, Table } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { RawEventData } from '../interfaces/event.interface';
import { EventRegistration } from './event-registration.model';
import { Organization } from './organization.model';
import { User } from './user.model';
import { Op } from 'sequelize';
import { currentOrg } from './current-org.scope';
import { Team } from './team.model';
import { LoggedModel } from './logged.model';

@DefaultScope(() => ({
    required: false,
    order: [['start_date', 'ASC']]
}))
@Scopes(() => ({
    full: {
        include: [Organization, { model: User, as: 'author' }, { model: User, as: 'registered_users' }]
    },
    expired: (date: Date) => ({
        required: false,
        where: {
            end_date: {
                [Op.lte]: date
            }
        }
    }),
    notExpired: (date: Date) => ({
        required: false,
        where: {
            end_date: {
                [Op.gt]: date
            }
        }
    }),
    ordered: {
        required: false,
        order: [['start_date', 'ASC']]
    },
    free: {
        required: false,
        where: {
            price: null
        }
    },
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id),
    onlyAllowedTeam: (allowed_team_id: string, public_team_id: string) => ({
        required: false,
        where: {
            [Op.or]: [
                {
                    allowed_team_id: allowed_team_id
                },
                {
                    allowed_team_id: public_team_id
                },
                {
                    allowed_team_id: 'public'
                }
            ]
        }
    }),
    public: {
        required: false,
        where: {
            allowed_team_id: 'public'
        }
    }
}))

@Table
export class Event extends LoggedModel {

    public static modelName = 'Event';
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @Column
    description: string; // 10000 chars long
    @IsInt
    @AllowNull
    @Column
    price: number; //In cent
    @IsDate
    @Column
    start_date: Date;
    @IsDate
    @Column
    end_date: Date;
    @IsInt
    @AllowNull
    @Column
    max_participants: number;
    @ForeignKey(() => User)
    @Column
    author_id: string;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;
    @ForeignKey(() => Team)
    @Column
    allowed_team_id: string;

    @BelongsTo(() => Organization)
    organization: Organization;
    @BelongsTo(() => User)
    author: User;
    @BelongsTo(() => Team)
    allowed_team: Team;
    @BelongsToMany(() => User, () => EventRegistration)
    registered_users: Array<User & { event_registrations: EventRegistration }>;

    @BeforeCreate
    static addUuid(instance: Event): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawEventData> {
        return [
            'title',
            'description',
            'start_date',
            'end_date',
            'author_id',
            'allowed_team_id',
            'org_id'
        ];
    }
}