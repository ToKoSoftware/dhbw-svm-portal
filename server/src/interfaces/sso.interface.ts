import {User} from '../models/user.model';

export interface SSORequestData {
    id: string;
    user: User;
}
