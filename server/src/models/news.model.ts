import { BeforeCreate, BelongsTo, Column, DefaultScope, ForeignKey, NotEmpty, PrimaryKey, Scopes, Table } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { RawNewsData } from '../interfaces/news.interface';
import { currentOrg } from './current-org.scope';
import { LoggedModel } from './logged.model';
import { Organization } from './organization.model';
import { User } from './user.model';

@DefaultScope(() => ({
    required: false, 
    include: User.scope('publicData')
}))
@Scopes(() => ({
    full: {
        include: [Organization, User]
    },
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id)
}))

@Table
export class News extends LoggedModel {

    public static modelName = 'News';
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
        ];
    }
}