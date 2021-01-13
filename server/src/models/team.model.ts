import {BelongsTo, BelongsToMany, Column, DefaultScope, ForeignKey, HasMany, Model, NotEmpty, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import {RawTeamData} from '../interfaces/team.interface';
import { Membership } from './membership.model';
import { Organization } from './organization.model';
import { Poll } from './poll.model';
import { Role } from './role.model';
import { User } from './user.model';

@DefaultScope(() => ({
    required: false,
    where: {
        is_active: true
    }
}))
@Scopes(() => ({
    full: {
        include: [Organization, Role, User]
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
export class Team extends Model {

    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @Column
    is_active: boolean;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;
    @ForeignKey(() => Role)
    @Column
    maintain_role_id: string;

    @BelongsTo(() => Organization)
    organization: Organization;
    @BelongsTo(() => Role)
    maintain_role: Role;
    @BelongsToMany(() => User, () => Membership)
    users: Array<User & {membership: Membership}>;

    @HasMany(() => Poll)
    can_answer_polls: Poll[];

    public static requiredFields(): Array<keyof RawTeamData> {
        return [
            'title'
        ];
    }
}