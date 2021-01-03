import {User} from '../models/user.model';
import {Vars} from '../vars';
import jwt from 'jsonwebtoken';

export function jwtSign(user: User, expiration = 3600): string{
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            is_admin: user.is_admin
        },
        Vars.config.database.jwtSalt,
        {
            // standard expiration after 1h = 3600s
            expiresIn: expiration
        }
    );
    return token;
}