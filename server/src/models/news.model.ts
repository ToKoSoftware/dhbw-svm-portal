import {BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table} from 'sequelize-typescript';
import {RawNewsData} from '../interfaces/news.interface';
import { Organization } from './organization.model';
import { User } from './user.model';

@Table
export class News extends Model {
    
    @PrimaryKey
    @Column
    id: string;
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

    public static requiredFields(): Array<keyof RawNewsData> {
        return [
            'title',
            'body'
        ];
    }
}