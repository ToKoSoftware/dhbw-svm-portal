import {BeforeCreate, BelongsTo, Column, DefaultScope, ForeignKey, Model, PrimaryKey, Table} from 'sequelize-typescript';
import {v4 as uuidv4} from 'uuid';
import {User} from './user.model';

@DefaultScope(() => ({
    required: false,
    include: [User]
}))
@Table
export class SingleSignOnRequest extends Model {

    @PrimaryKey
    @Column
    id: string;

    @ForeignKey(() => User)
    @Column
    user_id: string;

    @BelongsTo(() => User)
    user: User;

    @BeforeCreate
    static addUuid(instance: SingleSignOnRequest): string {
        return instance.id = uuidv4();
    }

}
