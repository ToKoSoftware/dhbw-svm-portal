import {Model, Table, Column, ForeignKey, BelongsTo, HasOne, HasMany, BelongsToMany, PrimaryKey} from 'sequelize-typescript';
import {RawRoleData} from '../interfaces/role.interface';
import { Organization } from './organization.model';
import { RoleAssignment } from './role-assignment.model';
import { Team } from './team.model';
import { User } from './user.model';

@Table
export class Role extends Model {

    @PrimaryKey
    @Column
    id: string;
    @Column
    title: string;
    @Column
    user_deletable: boolean;
    @Column
    is_active: boolean;
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


    public static requiredFields(): Array<keyof RawRoleData> {
        return [
            'title',
            'user_deletable'
        ];
    }
}