export interface UserData {
    id?: string;
    email: string;
    username: string;
    password: string;
    is_admin: boolean;
    first_name: string;
    last_name: string;
    gender: genderType;
    street: string;
    street_number: string;
    post_code: string;
    city: string;
    is_active: boolean
}

export interface UserLoginData {
    email?: string;
    username?: string;
    password: string;
}

export type genderType = 'M' | 'W' | 'D';