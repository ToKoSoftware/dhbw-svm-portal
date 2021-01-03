import Loggy from './functions/loggy.func';
import {Configuration} from './interfaces/configutation.interface';
import {Op, Sequelize} from 'sequelize';
import {User} from './models/user.model';


export abstract class Vars {
    public static loggy: Loggy;
    public static config: Configuration;
    public static db: Sequelize;
    public static op: typeof Op;
    public static currentUser: User;
    public static currentJWT: string;
}
