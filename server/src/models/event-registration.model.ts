import {Model, Table, ForeignKey, Column, BelongsTo, PrimaryKey, IsUUID} from 'sequelize-typescript';
import { Event } from './event.model';
import { User } from './user.model';

@Table
export class EventRegistration extends Model {
    
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;
    @IsUUID(4)
    @ForeignKey(() => User)
    @Column
    user_id: string;
    @IsUUID(4)
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