import { BeforeCreate, BelongsTo, Column, ForeignKey, PrimaryKey, Scopes, Table } from 'sequelize-typescript';
import { Role } from './role.model';
import { User } from './user.model';
import { v4 as uuidv4 } from 'uuid';
import { RawRoleAssignmentData } from '../interfaces/role-assignment.interface';
import { LoggedModel } from './logged.model';

@Scopes(() => ({
    full: {
        required: false,
        include: [User, Role]
    }
}))

@Table
export class RoleAssignment extends LoggedModel {

    public static modelName = 'RoleAssignment';
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

    @BeforeCreate
    static addUuid(instance: RoleAssignment): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawRoleAssignmentData> {
        return [
            'user_id',
            'role_id'
        ];
    }
}