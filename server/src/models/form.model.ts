import {BeforeCreate, BelongsTo, Column, ForeignKey, HasMany, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import {User} from './user.model';
import {v4 as uuidv4} from 'uuid';
import {LoggedModel} from './logged.model';
import {currentOrg} from './current-org.scope';
import {Organization} from './organization.model';
import {FormInstance} from './form-instance.model';

@Scopes(() => ({
    full: {
        include: []
    },
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id)
}))

@Table({
    paranoid: true
})
export class Form extends LoggedModel {

    public static modelName = 'Form';

    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @NotEmpty
    @Column
    description: string;
    @Column
    config: string;
    @Column
    allowed_team_id: string;
    @ForeignKey(() => User)
    @Column
    author_id: string;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;

    @BelongsTo(() => Organization)
    organization: Organization;

    @BelongsTo(() => User, 'author_id')
    author: User;

    @HasMany(() => FormInstance)
    instances: FormInstance[];

    @BeforeCreate
    static addUuid(instance: Form): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof Form> {
        return [
            'title',
            'description'
        ];
    }
}
