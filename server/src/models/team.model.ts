import {BelongsTo, BelongsToMany, Column, ForeignKey, HasMany, Model, Table} from 'sequelize-typescript';
import {TeamData} from '../interfaces/team.interface';
import { Membership } from './membership.model';
import { Organization } from './organization.model';
import { Poll } from './poll.model';
import { Role } from './role.model';
import { User } from './user.model';

@Table
export class Team extends Model {

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
    @BelongsToMany(() => User, () => Membership)
    users: Array<User & {membership: Membership}>;

    @HasMany(() => Poll)
    can_answer_polls: Poll[];

    public static requiredFields(): Array<keyof TeamData> {
        return [
            'title'
        ];
    }
}