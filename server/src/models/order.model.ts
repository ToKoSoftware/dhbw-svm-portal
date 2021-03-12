import { Table, PrimaryKey, Column, IsInt, ForeignKey, BeforeCreate, BelongsTo, Scopes, DefaultScope } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { RawOrderData } from '../interfaces/order.interface';
import { currentOrg } from './current-org.scope';
import { Item } from './item.model';
import { LoggedModel } from './logged.model';
import { Organization } from './organization.model';
import { User } from './user.model';

@DefaultScope(() => ({
    required: false,
    order: [['createdAt', 'DESC']]
}))

@Scopes(() => ({
    full: {
        required: false,
        include: [Organization, User, Item]
    },
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id),
    ordered: {
        required: false,
        order: [['createdAt', 'DESC']]
    },
    onlyOwnOrder: (user_id: string) => ({
        required: false,
        where: {
            user_id: user_id
        }
    }),
}))

@Table({
    paranoid: true
})
export class Order extends LoggedModel {

    public static modelName = 'Order';
    @PrimaryKey
    @Column
    id: string;
    @ForeignKey(() => User)
    @Column
    user_id: string;
    @ForeignKey(() => Item)
    @Column
    item_id: string;
    @IsInt
    @Column
    amount: number;
    @IsInt
    @Column
    value: number; //In cent
    @Column
    payment_done: boolean;
    @Column
    delivered: boolean;
    

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => Item)
    item: Item;

    @BeforeCreate
    static addUuid(instance: Order): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawOrderData> {
        return [
            'user_id',
            'item_id',
            'amount',
            'value',
            'payment_done',
            'delivered'
        ];
    }

}