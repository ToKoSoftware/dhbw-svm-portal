import {Model, Table, Column, ForeignKey, BelongsTo, HasOne, HasMany, BelongsToMany, PrimaryKey, IsUUID, NotEmpty, DefaultScope, Scopes} from 'sequelize-typescript';
import {RoleData} from '../interfaces/role.interface';
import { Organization } from './organization.model';
import { RoleAssignment } from './role-assignment.model';
import { Team } from './team.model';
import { User } from './user.model';

@DefaultScope(() => ({
    where: {
        is_active: true
    }
}))
@Scopes(() => ({
    full: {
        include: [{model: Organization, as: 'organization'},{model: Organization, as: 'admin_of_organization'}, Team, User]
    },
    fullAndActive: {
        include: [{model: Organization, as: 'organization'},{model: Organization, as: 'admin_of_organization'}, Team, User],
        where: {
            is_active: true
        }
    }
}))

@Table
export class Role extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @Column
    user_deletable: boolean;
    @Column
    is_active: boolean;
    @IsUUID(4)
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
    users: Array<User & {role_assignment: RoleAssignment}>;


    public static requiredFields(): Array<keyof RoleData> {
        return [
            'title',
            'user_deletable'
        ];
    }
}