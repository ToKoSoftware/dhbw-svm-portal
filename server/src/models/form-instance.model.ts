import {BeforeCreate, BelongsTo, Column, ForeignKey, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {LoggedModel} from './logged.model';
import {User} from './user.model';
import {Form} from './form.model';
import {currentOrg} from './current-org.scope';
import {Organization} from './organization.model';

@Scopes(() => ({
    full: {
        required: false,
        include: [User, Form]
    },
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id)
}))

@Table({
    paranoid: true
})
export class FormInstance extends LoggedModel {

    public static modelName = 'FormInstance';
    @PrimaryKey
    @Column
    id: string;
    @ForeignKey(() => User)
    @Column
    user_id: string;
    @ForeignKey(() => Form)
    @Column
    form_id: string;
    @Column
    value: string;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => Form)
    event: Form;

    @BeforeCreate
    static addUuid(instance: FormInstance): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof FormInstance> {
        return [];
    }
}
