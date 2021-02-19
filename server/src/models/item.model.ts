import { Table, PrimaryKey, Column, NotEmpty, IsInt, ForeignKey, BeforeCreate, BelongsTo, Scopes, DefaultScope } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { RawItemData } from '../interfaces/item.interface';
import { currentOrg } from './current-org.scope';
import { LoggedModel } from './logged.model';
import { Organization } from './organization.model';

@DefaultScope(() => ({
    required: false,
    order: [['title', 'ASC']]
}))

@Scopes(() => ({
    full: {
        required: false,
        include: [Organization]
    },
    onlyCurrentOrg: (org_id: string) => currentOrg(org_id),
    ordered: {
        required: false,
        order: [['title', 'ASC']]
    }
}))

@Table
export class Item extends LoggedModel {

    public static modelName = 'Item';
    @PrimaryKey
    @Column
    id: string;
    @NotEmpty
    @Column
    title: string;
    @Column
    description: string; // 10000 chars long
    @IsInt
    @Column
    price: number; //In cent
    @ForeignKey(() => Organization)
    @Column
    org_id: string;

    @BelongsTo(() => Organization)
    organization: Organization;

    @BeforeCreate
    static addUuid(instance: Item): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawItemData> {
        return [
            'title',
            'description',
            'price',
            'org_id'
        ];
    }

}