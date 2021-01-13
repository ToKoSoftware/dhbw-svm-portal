import {AllowNull, BelongsTo, BelongsToMany, Column, ForeignKey, Model, PrimaryKey, Table} from 'sequelize-typescript';
import {RawEventData} from '../interfaces/event.interface';
import { EventRegistration } from './event-registration.model';
import { Organization } from './organization.model';
import { User } from './user.model';

@Table
export class Event extends Model {

    @PrimaryKey
    @Column
    id: string;
    @Column
    title: string;
    @Column
    description: string;
    @AllowNull
    @Column
    price: number;
    @Column
    date: Date;
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