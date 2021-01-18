import { RawUserData } from '../interfaces/users.interface';
import * as bcrypt from 'bcryptjs';

export async function mapUser(incomingData: RawUserData): Promise<RawUserData> {

    const SALT_FACTOR = 10;
    const hashedPassword =  incomingData.password !== undefined ? await bcrypt.hash(incomingData.password, SALT_FACTOR) : incomingData.password;
    const dateParts = incomingData.birthday !== undefined ? incomingData.birthday.toString().split('.') : incomingData.birthday;

    return {
        ...incomingData,
        birthday: incomingData.birthday !== undefined ? new Date(Date.UTC(+dateParts[2], +dateParts[1]-1, +dateParts[0])) : incomingData.birthday,
        password: hashedPassword,
        is_admin: false,
    };
}
