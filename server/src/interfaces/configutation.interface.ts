export interface Configuration {
    logging: boolean;
    database: DatabaseCredentials
}

export interface DatabaseCredentials {
    username: string;
    url: string;
    dbname: string;
    password: string;
    port: string;
    jwtSalt: string;
}
