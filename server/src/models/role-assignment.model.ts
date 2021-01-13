import {BelongsTo, Column, ForeignKey, Model, PrimaryKey, Scopes, Table} from 'sequelize-typescript';
import { Role } from './role.model';
import { User } from './user.model';

@Scopes(() => ({
    full: {
        required: false,
        include: [User, Role]
    }
}))

@Table
export class RoleAssignment extends Model {

    @PrimaryKey
    @Column
    id: string;
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