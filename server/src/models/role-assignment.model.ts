import {BelongsTo, Column, ForeignKey, IsUUID, Model, PrimaryKey, Table} from 'sequelize-typescript';
import { Role } from './role.model';
import { User } from './user.model';

@Table
export class RoleAssignment extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column
    id: string;
    @IsUUID(4)
    @ForeignKey(() => User)
    @Column
    user_id: string;
    @IsUUID(4)
    @ForeignKey(() => Role)
    @Column
    role_id: string;

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => Role)
    role: Role;
}