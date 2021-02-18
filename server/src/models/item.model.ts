import { Table, PrimaryKey, Column, NotEmpty, IsInt, AllowNull, ForeignKey, BeforeCreate, BelongsTo } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { RawItemData } from '../interfaces/item.interface';
import { LoggedModel } from './logged.model';
import { Organization } from './organization.model';

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
    @AllowNull
    @Column
    price: number; //In cent
    @IsInt
    @Column
    stock: number;
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
            'stock',
            'org_id'
        ];
    }

}