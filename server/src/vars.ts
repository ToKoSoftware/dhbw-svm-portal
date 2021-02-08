import Loggy from './functions/loggy.func';
import {Configuration} from './interfaces/configutation.interface';
import {Op, Sequelize} from 'sequelize';
import {User} from './models/user.model';
import {Organization} from './models/organization.model';


export abstract class Vars {
    public static loggy: Loggy;
    public static config: Configuration;
    public static db: Sequelize;
    public static op: typeof Op;
    public static currentUser: User;
    public static currentOrganization: Organization;
    public static currentUserIsAdmin: boolean;
    public static currentJWT: string;
}
