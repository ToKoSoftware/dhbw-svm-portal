import {Model, Table, Column, ForeignKey, BelongsTo, HasOne, HasMany} from 'sequelize-typescript';
import {RoleData} from '../interfaces/role.interface';
import { Organization } from './organization.model';
import { Team } from './team.model';

@Table
export class Role extends Model {

    @Column
    title: string;
    @Column
    user_deletable: boolean;
    @Column
    is_active: boolean;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;

    @BelongsTo(() => Organization)
    organization: Organization;
    @HasOne(() => Organization)
    admin_of_organization: Organization;
    @HasMany(() => Team)
    maintained_teams: Team[];

    public static requiredFields(): Array<keyof RoleData> {
        return [
            'title',
            'user_deletable'
        ];
    }
}