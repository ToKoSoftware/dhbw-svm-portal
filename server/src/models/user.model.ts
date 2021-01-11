import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {genderType, UserData} from '../interfaces/users.interface';

@Table
export class User extends Model<User> {

    @Column
    email: string;
    @Column
    username: string;
    @Column
    password: string;
    @Column
    is_admin: boolean;
    @Column
    first_name: string;
    @Column
    last_name: string;
    @Column
    gender: genderType;
    @Column
    street: string;
    @Column
    street_number: string;
    @Column
    post_code: string;
    @Column
    city: string;
    @Column
    is_active: boolean;

    public static requiredFields(): Array<keyof UserData> {
        return [
            'email',
            'username',
            'password',
            'first_name',
            'last_name',
            'gender',
            'street',
            'street_number',
            'post_code',
            'city'
        ];
    }

    @BeforeCreate
    static addUuid(instance: User): string {
        return instance.id = uuidv4();
    }
}
