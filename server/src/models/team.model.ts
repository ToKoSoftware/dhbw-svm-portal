import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {TeamData} from '../interfaces/team.interface';

@Table
export class Team extends Model<Team> {

    @Column
    title: string;
    @Column
    is_active: boolean;

    public static requiredFields(): Array<keyof TeamData> {
        return [
            'title'
        ];
    }

    @BeforeCreate
    static addUuid(instance: Team): string {
        return instance.id = uuidv4();
    }
}