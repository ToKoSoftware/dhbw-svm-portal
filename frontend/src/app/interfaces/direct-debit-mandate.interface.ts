import {UserData} from './user.interface';

export interface DirectDebitMandateData {
  id: string;
  IBAN: string;
  bank_name: string;
  user: UserData
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string;
}
