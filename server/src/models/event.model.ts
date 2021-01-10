import {BeforeCreate, Column, Model, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {EventData} from '../interfaces/event.interface';

@Table
export class Event extends Model<Event> {

    @Column
    title: string;
    @Column
    description: string;
    @Column
    price: number | null;
    @Column
    date: Date;
    @Column
    max_participants: number | null;
    @Column
    is_active: boolean;

    public static requiredFields(): Array<keyof EventData> {
        return [
            'title',
            'description',
            'price',
            'date',
            'max_participants'
        ];
    }

    @BeforeCreate
    static addUuid(instance: Event): string {
        return instance.id = uuidv4();
    }
}