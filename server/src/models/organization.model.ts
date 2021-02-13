import {
    BeforeCreate,
    BelongsTo,
    Column,
    DefaultScope,
    ForeignKey,
    HasMany,
    Model,
    NotEmpty,
    PrimaryKey,
    Scopes,
    Table, Unique
} from 'sequelize-typescript';
import { RawOrganizationData } from '../interfaces/organization.interface';
import { Event } from './event.model';
import { News } from './news.model';
import { Poll } from './poll.model';
import { Role } from './role.model';
import { Team } from './team.model';
import { User } from './user.model';
import { v4 as uuidv4 } from 'uuid';
import { DirectDebitMandate } from './direct-debit-mandate.model';

@DefaultScope(() => ({
    required: false,
    attributes: {
        exclude: ['access_code', 'config']
    },
    where: {
        is_active: true
    }
}))
@Scopes(() => ({
    full: {
        include: [{ model: Role, as: 'admin_role' }, { model: Role, as: 'roles' }, User, Team, News, Poll, Event]
    },
    active: {
        required: false,
        attributes: {
            exclude: ['access_code']
        },
        where: {
            is_active: true
        }
    },
    inactive: {
        required: false,
        attributes: {
            exclude: ['access_code']
        },
        where: {
            is_active: false
        }
    }
}))

@Table
export class Organization extends Model {

    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @NotEmpty
    @Unique
    @Column
    access_code: string;
    @Column
    config: string;
    @Column
    is_active: boolean;
    @Column
    CI: string; // "Gläubiger-Identifikationsnummer"
    @Column
    direct_debit_mandate_contract_text: string;
    @ForeignKey(() => Role)
    @Column
    admin_role_id: string;

    @BelongsTo(() => Role, 'admin_role_id')
    admin_role: Role;

    @HasMany(() => User)
    users: User[];
    @HasMany(() => Event)
    events: Event[];
    @HasMany(() => News)
    news: News[];
    @HasMany(() => Poll)
    polls: Poll[];
    @HasMany(() => Role, 'org_id')
    roles: Role[];
    @HasMany(() => Team)
    teams: Team[];
    @HasMany(() => DirectDebitMandate)
    direct_debit_mandates: DirectDebitMandate[];

    @BeforeCreate
    static addUuid(instance: Organization): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawOrganizationData> {
        return [
            'title',
            'access_code'
        ];
    }
}
