import {genderType, UserData} from '../interfaces/users.interface';
import {BelongsTo, Column, ForeignKey, Model, Table} from 'sequelize-typescript';
import { Organization } from './organization.model';

@Table
export class User extends Model {

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
    @ForeignKey(() => Organization)
    @Column
    org_id: string;

    @BelongsTo(() => Organization)
    organization: Organization;

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
}