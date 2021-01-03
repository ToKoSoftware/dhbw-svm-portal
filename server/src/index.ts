import startServer from './server';
import {connectToDatabase} from './bootstrap/connect-db.func';
import {Vars} from './vars';
import Loggy from './functions/loggy.func';
import {loadConfig} from './bootstrap/load-config.func';

Vars.loggy = new Loggy();
Vars.config = loadConfig();
connectToDatabase();
startServer();
