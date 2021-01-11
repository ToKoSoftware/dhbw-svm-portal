import {genderType, UserData} from '../interfaces/users.interface';
import {BelongsTo, BelongsToMany, Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import { Organization } from './organization.model';
import { EventRegistration } from './event-registration.model';
import { Event } from './event.model';

@Table
export class User extends Model {

    @Column
    email: string;
    @Column
    username: string;
    @Column
    password: string;
    @Column
    is_admin: boolean;
    @Column
    first_name: string;
    @Column
    last_name: string;
    @Column
    gender: genderType;
    @Column
    street: string;
    @Column
    street_number: string;
    @Column
    post_code: string;
    @Column
    city: string;
    @Column
    is_active: boolean;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;

    @BelongsTo(() => Organization)
    organization: Organization;
    @BelongsToMany(() => Event, () => EventRegistration)
    registered_events: Array<Event & {event_registrations: EventRegistration}>;

    public static requiredFields(): Array<keyof UserData> {
        return [
            'email',
            'username',
            'password',
            'first_name',
            'last_name',
            'gender',
            'street',
            'street_number',
            'post_code',
            'city'
        ];
    }
}