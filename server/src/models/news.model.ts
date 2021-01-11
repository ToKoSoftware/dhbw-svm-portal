import {BelongsTo, Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import {NewsData} from '../interfaces/news.interface';
import { Organization } from './organization.model';
import { User } from './user.model';

@Table
export class News extends Model {
    
    @Column
    title: string;
    @Column
    body: string;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;
    @ForeignKey(() => User)
    @Column
    author_id: string;
    @Column
    is_active: boolean;

    @BelongsTo(() => Organization)
    organization: Organization;
    @BelongsTo(() => User)
    author: User;

    public static requiredFields(): Array<keyof NewsData> {
        return [
            'title',
            'body'
        ];
    }
}