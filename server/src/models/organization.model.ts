import {Column, HasMany, Model, Table} from 'sequelize-typescript';
import {OrganizationData} from '../interfaces/organization.interface';
import { Event } from './event.model';
import { News } from './news.model';
import { Poll } from './poll.model';
import { User } from './user.model';

@Table
export class Organization extends Model {

    @Column
    title: string;
    @Column
    access_code: string;
    @Column
    config: string;
    @Column
    is_active: boolean;

    @HasMany(() => User)
    users: User[];
    @HasMany(() => Event)
    events: Event[];
    @HasMany(() => News)
    news: News[];
    @HasMany(() => Poll)
    polls: Poll[];

    
    public static requiredFields(): Array<keyof OrganizationData> {
        return [
            'title',
            'access_code',
            'config'
        ];
    }
}