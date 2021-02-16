import { Table, ForeignKey, Column, BelongsTo, PrimaryKey, Scopes, BeforeCreate } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { RawDirectDebitMandateData } from '../interfaces/direct-debit-mandate.interface';
import { LoggedModel } from './logged.model';
import { Organization } from './organization.model';
import { User } from './user.model';

@Scopes(() => ({
    full: {
        required: false,
        include: [User, Organization]
    }
}))

@Table({
    paranoid: true
})
export class DirectDebitMandate extends LoggedModel {

    public static modelName = 'DirectDebitMandate';
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
    bank_name: string;
    @Column
    IBAN: string;

    @BelongsTo(() => User)
    user: User;
    @BelongsTo(() => Organization)
    organization: Organization;

    @BeforeCreate
    static addUuid(instance: DirectDebitMandate): string {
        return instance.id = uuidv4();
    }

    public static requiredFields(): Array<keyof RawDirectDebitMandateData> {
        return [
            'user_id',
            'org_id',
            'bank_name',
            'IBAN'
        ];
    }
}