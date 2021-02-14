import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';

export interface DirectDebitMandateDataSnapshot{
    id?: string;
    bank_name: string;
    IBAN: boolean;
}

export interface RawDirectDebitMandateData extends DirectDebitMandateDataSnapshot{
    user_id: string;
    org_id: string;
}

export interface DirectDebitMandateData extends DirectDebitMandateDataSnapshot{
    user: User;
    organization: Organization;
}