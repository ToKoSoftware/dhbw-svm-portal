import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {OrganizationData} from '../interfaces/organization.interface';

@Table
export class Organization extends Model<Organization> {

    @Column
    title: string;
    @Column
    access_code: string;
    @Column
    config: JSON;
    @Column
    is_active: boolean;

    public static requiredFields(): Array<keyof OrganizationData> {
        return [
            'title',
            'access_code',
            'config'
        ];
    }

    @BeforeCreate
    static addUuid(instance: Organization): string {
        return instance.id = uuidv4();
    }
}