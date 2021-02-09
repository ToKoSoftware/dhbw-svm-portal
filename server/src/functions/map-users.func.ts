import { RawUserData } from '../interfaces/users.interface';
import * as bcrypt from 'bcryptjs';

export async function mapUser(incomingData: RawUserData): Promise<RawUserData> {

    const SALT_FACTOR = 10;
    const hashedPassword =  incomingData.password !== undefined ? await bcrypt.hash(incomingData.password, SALT_FACTOR) : incomingData.password;
    const birthday = incomingData.birthday !== undefined ? new Date(incomingData.birthday) : incomingData.birthday;

    return {
        ...incomingData,
        birthday: birthday,
        password: hashedPassword
    };
}
