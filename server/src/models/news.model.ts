import {BelongsTo, Column, DefaultScope, ForeignKey, Model, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import {RawNewsData} from '../interfaces/news.interface';
import { Organization } from './organization.model';
import { User } from './user.model';

@DefaultScope(() => ({
    required: false,
    where: {
        is_active: true
    }
}))
@Scopes(() => ({
    full: {
        include: [Organization, User]
    },
    active: {
        required: false,
        where: {
            is_active: true
        }
    },
    inactive: {
        required: false,
        where: {
            is_active: false
        }
    }
})) 

@Table
export class News extends Model {
    
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
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