import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {NewsData} from '../interfaces/news.interface';

@Table
export class News extends Model<News> {

    @Column
    title: string;
    @Column
    body: string;
    @Column
    is_active: boolean;

    public static requiredFields(): Array<keyof NewsData> {
        return [
            'title',
            'body'
        ];
    }

    @BeforeCreate
    static addUuid(instance: News): string {
        return instance.id = uuidv4();
    }
}