import { Table, ForeignKey, Column, BelongsTo, PrimaryKey, Scopes, BeforeCreate } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { RawEventRegistrationData } from '../interfaces/event-registration.interface';
import { Event } from './event.model';
import { LoggedModel } from './logged.model';
import { User } from './user.model';

@Scopes(() => ({
    full: {
        required: false,
        include: [User, Event]
    }
}))

@Table
export class EventRegistration extends LoggedModel {

    public static modelName = 'EventRegistration';
    @PrimaryKey
    @Column
    id: string;
    @ForeignKey(() => User)
    @Column
    user_id: string;
    @ForeignKey(() => Event)
    @Column
    event_id: string;
    @Column
    body: string; //5000 chars long
    @Column
    payment_done: boolean;

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => Event)
    event: Event;

    @BeforeCreate
    static addUuid(instance: EventRegistration): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawEventRegistrationData> {
        return [
            'body',
            'payment_done',
            'user_id',
            'event_id'
        ];
    }
}