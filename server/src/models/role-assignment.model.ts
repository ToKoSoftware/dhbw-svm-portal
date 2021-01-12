import {BelongsTo, Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import { Role } from './role.model';
import { User } from './user.model';

@Table
export class RoleAssignment extends Model {

    @ForeignKey(() => User)
    @Column
    user_id: string;
    @ForeignKey(() => Role)
    @Column
    role_id: string;

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => Role)
    role: Role;
}