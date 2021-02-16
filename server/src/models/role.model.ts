import { BeforeCreate, Table, Column, ForeignKey, BelongsTo, HasOne, HasMany, BelongsToMany, PrimaryKey, NotEmpty, Scopes, DefaultScope } from 'sequelize-typescript';
import { RawRoleData } from '../interfaces/role.interface';
import { currentOrg } from './current-org.scope';
import { Organization } from './organization.model';
import { RoleAssignment } from './role-assignment.model';
import { Team } from './team.model';
import { User } from './user.model';
import { v4 as uuidv4 } from 'uuid';
import { LoggedModel } from './logged.model';

@DefaultScope(() => ({
    required: false,
    order: [['title', 'ASC']]
}))

@Scopes(() => ({
    full: {
        include: [{ model: Organization, as: 'organization' }, { model: Organization, as: 'admin_of_organization' }, Team, User]
    },
    ordered: {
        required: false,
        order: [['title', 'ASC']]
    },
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id)
}))

@Table
export class Role extends LoggedModel {

    public static modelName = 'Role';
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @Column
    user_deletable: boolean;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;

    @BelongsTo(() => Organization, 'org_id')
    organization: Organization;
    @HasOne(() => Organization, 'admin_role_id')
    admin_of_organization: Organization;
    @HasMany(() => Team)
    maintained_teams: Team[];

    @BelongsToMany(() => User, () => RoleAssignment)
    users: Array<User & { role_assignment: RoleAssignment }>;

    @BeforeCreate
    static addUuid(instance: Role): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawRoleData> {
        return [
            'title',
            'user_deletable'
        ];
    }
}