import {BelongsTo, Column, DefaultScope, ForeignKey, IsUUID, Model, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import {NewsData} from '../interfaces/news.interface';
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
    fullAndActive: {
        required: false,
        include: [Organization, User],
        where: {
            is_active: true
        }
    }
})) 

@Table
export class News extends Model {
    
    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @Column
    body: string;
    @IsUUID(4)
    @ForeignKey(() => Organization)
    @Column
    org_id: string;
    @IsUUID(4)
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