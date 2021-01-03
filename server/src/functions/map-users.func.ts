import { UserData } from '../interfaces/users.interface';
import * as bcrypt from 'bcryptjs';

export async function mapUser(incomingData: UserData): Promise<UserData> {

    const SALT_FACTOR = 10;
    const hashedPassword =  incomingData.password !== undefined ? await bcrypt.hash(incomingData.password, SALT_FACTOR) : incomingData.password;

    return {
        ...incomingData,
        password: hashedPassword,
        is_admin: false,
    };
}
