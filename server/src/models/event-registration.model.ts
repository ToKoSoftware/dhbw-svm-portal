import {Model, Table, ForeignKey, Column, BelongsTo, PrimaryKey, Scopes} from 'sequelize-typescript';
import { Event } from './event.model';
import { User } from './user.model';

@Scopes(() => ({
    full: {
        required: false,
        include: [User, Event]
    }
}))

@Table
export class EventRegistration extends Model {
    
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
    body: string;
    @Column
    payment_done: boolean;

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => Event)
    event: Event;
}