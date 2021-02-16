import { Model, Table, ForeignKey, Column, BelongsTo, PrimaryKey, BeforeCreate, DefaultScope } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { RawEventLogData } from '../interfaces/event-log.interface';
import { Organization } from './organization.model';
import { User } from './user.model';

@DefaultScope(() => ({
    required: false,
    include: [User],
    order: [['createdAt', 'DESC']]
}))

@Table
export class EventLog extends Model {

    @PrimaryKey
    @Column
    id: string;
    @ForeignKey(() => User)
    @Column
    user_id: string;
    @ForeignKey(() => Organization)
    @Column
    org_id: string;
    @Column
    called_function: string;
    @Column
    success: boolean;

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => Organization)
    organization: Organization;

    @BeforeCreate
    static addUuid(instance: EventLog): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawEventLogData> {
        return [
            'user_id',
            'org_id',
            'called_function',
            'success'
        ];
    }
}