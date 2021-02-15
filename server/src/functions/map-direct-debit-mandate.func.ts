import { DirectDebitMandateDataSnapshot, RawDirectDebitMandateData } from '../interfaces/direct-debit-mandate.interface';
import { Vars } from '../vars';

export function mapDirectDebitMandate(incomingData: DirectDebitMandateDataSnapshot): RawDirectDebitMandateData {
    return {
        ...incomingData, 
        user_id: Vars.currentUser.id,
        org_id: Vars.currentOrganization.id
    };
}