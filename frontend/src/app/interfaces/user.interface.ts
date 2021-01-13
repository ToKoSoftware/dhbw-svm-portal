export interface UserData {
  id: string;
  email: string;
  password?: string;
  is_admin: boolean;
  first_name: string;
  last_name: string;
  street: string;
  street_number: string;
  post_code: string;
  city: string;
  is_active: boolean
  createdAt: string;
  updatedAt: string;
}
