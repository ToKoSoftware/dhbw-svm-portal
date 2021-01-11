import {Column, HasMany, Model, Table} from 'sequelize-typescript';
import {OrganizationData} from '../interfaces/organization.interface';
import { User } from './user.model';

@Table
export class Organization extends Model {

    @Column
    title: string;
    @Column
    access_code: string;
    @Column
    config: string;
    @Column
    is_active: boolean;

    public static requiredFields(): Array<keyof OrganizationData> {
        return [
            'title',
            'access_code',
            'config'
        ];
    }

    @HasMany(() => User)
    users: User[];
}