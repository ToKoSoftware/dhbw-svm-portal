import {BeforeCreate, BelongsTo, Column, DefaultScope, ForeignKey, Model, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {RawNewsData} from '../interfaces/news.interface';
import { currentOrg } from './current-org.scope';
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
    },
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id)
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
    body: string; // 5000 chars long
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

    @BeforeCreate
    static addUuid(instance: News): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawNewsData> {
        return [
            'title',
            'body',
            'is_active'
        ];
    }
}