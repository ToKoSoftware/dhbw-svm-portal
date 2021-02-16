import { Request } from 'express';
import jwt from 'jsonwebtoken';

export function loadDecodedTokenFromHeader(req: Request): [boolean, (string | {[key: string]: any} | null)] {
    const header = req.headers.authorization;
    let userDataFromToken = null;
    if (header !== undefined) {
        const [bearer, token] = header.split(' ');
        userDataFromToken = jwt.decode(token);
        const success = (!(userDataFromToken instanceof Object) || userDataFromToken === null);
        return [success, userDataFromToken];
    } else {
        return [false, userDataFromToken];
    }
    
}