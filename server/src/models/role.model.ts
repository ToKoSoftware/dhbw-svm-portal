import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {RoleData} from '../interfaces/role.interface';

@Table
export class Role extends Model<Role> {

    @Column
    title: string;
    @Column
    user_deletable: boolean;
    @Column
    is_active: boolean;

    public static requiredFields(): Array<keyof RoleData> {
        return [
            'title',
            'user_deletable'
        ];
    }

    @BeforeCreate
    static addUuid(instance: Role): string {
        return instance.id = uuidv4();
    }
}