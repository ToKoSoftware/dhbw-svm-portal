import {Model, Table, ForeignKey, Column, BelongsTo} from 'sequelize-typescript';
import { Event } from './event.model';
import { User } from './user.model';

@Table
export class EventRegistration extends Model {
    
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