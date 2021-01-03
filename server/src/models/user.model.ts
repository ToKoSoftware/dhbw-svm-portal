import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {UserData} from '../interfaces/users.interface';

@Table
export class User extends Model<User> {

    @Column
    email: string;
    @Column
    password: string;
    @Column
    is_admin: boolean;
    @Column
    firstName: string;
    @Column
    lastName: string;
    @Column
    street: string;
    @Column
    streetNumber: number;
    @Column
    postcode: string;
    @Column
    city: number;
    @Column
    is_active: boolean;

    public static requiredFields(): Array<keyof UserData> {
        return [
            'email',
            'password',
            'firstName',
            'lastName',
            'street',
            'streetNumber',
            'postcode',
            'city'
        ];
    }

    @BeforeCreate
    static addUuid(instance: User): string {
        return instance.id = uuidv4();
    }
}
