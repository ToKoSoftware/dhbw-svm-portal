import {BelongsTo, Column, ForeignKey, Model} from 'sequelize-typescript';
import {EventData} from '../interfaces/event.interface';
import { Organization } from './organization.model';
import { User } from './user.model';

export class Event extends Model {

    @Column
    title: string;
    @Column
    description: string;
    @Column
    price: number | null;
    @Column
    date: Date;
    @Column
    max_participants: number | null;
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