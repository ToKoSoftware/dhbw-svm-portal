import {AllowNull, BelongsTo, BelongsToMany, Column, DefaultScope, ForeignKey, IsDate, IsInt, Model, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
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
            date: {
                [Op.lte]: date
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
    description: string;
    @IsInt
    @AllowNull
    @Column
    price: number; //In cent
    @IsDate
    @Column
    date: Date;
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

    public static requiredFields(): Array<keyof RawEventData> {
        return [
            'title',
            'description',
            'price',
            'date',
            'max_participants'
        ];
    }
}