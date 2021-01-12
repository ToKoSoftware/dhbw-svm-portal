import {AllowNull, BelongsTo, BelongsToMany, Column, DefaultScope, ForeignKey, IsDate, IsInt, IsUUID, Model, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import {EventData} from '../interfaces/event.interface';
import { EventRegistration } from './event-registration.model';
import { Organization } from './organization.model';
import { User } from './user.model';
import {Op} from 'sequelize';

@DefaultScope(() => ({
    where: {
        is_active: true,
        date: {
            [Op.gte]: Date()
        },

    }
}))
@Scopes(() => ({
    full: {
        include: [Organization, User]
    },
    fullAndActive: {
        include: [Organization, User],
        where: {
            is_active: true
        }
    },
    expired: {
        where: {
            $or: [
                {
                    closes_at: {
                        [Op.lte]: Date()
                    }
                },
                {
                    is_active: false
                }
            ]
        }
    },
    free: {
        where: {
            price: null
        }
    }
})) 

@Table
export class Event extends Model {

    @IsUUID(4)
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
    @IsUUID(4)
    @ForeignKey(() => User)
    @Column
    author_id: string;
    @IsUUID(4)
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

    public static requiredFields(): Array<keyof EventData> {
        return [
            'title',
            'description',
            'price',
            'date',
            'max_participants'
        ];
    }
}