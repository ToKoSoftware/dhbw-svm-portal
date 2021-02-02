import {AllowNull, BeforeCreate, BelongsTo, BelongsToMany, Column, DefaultScope, ForeignKey, IsDate, IsInt, Model, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {RawEventData} from '../interfaces/event.interface';
import { EventRegistration } from './event-registration.model';
import { Organization } from './organization.model';
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
        include: [Organization, {model: User, as: 'author'}, {model: User, as: 'registered_users'}]
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
            end_date: {
                [Op.lte]: date
            }
        }
    }),
    not_expired: (date: Date) => ({
        required: false,
        where: {
            end_date: {
                [Op.gt]: date
            }
        }
    }),
    free: {
        required: false,
        where: {
            price: null
        }
    },
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id)
})) 

@Table
export class Event extends Model {

    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @Column
    description: string; // 5000 chars long
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
    @Column
    is_active: boolean;

    @BelongsTo(() => Organization)
    organization: Organization;
    @BelongsTo(() => User)
    author: User;
    @BelongsToMany(() => User, () => EventRegistration)
    registered_users: Array<User & {event_registrations: EventRegistration}>;

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
            'is_active',
            'author_id',
            'org_id'
        ];
    }
}