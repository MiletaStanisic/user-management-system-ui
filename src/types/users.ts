import { UserPermission } from './permissions';

export interface UserListResponse {
  statusCode: number;
  message: string;
  data: {
    count: number;
    rows: Array<User>;
  };
}

export interface UserResponse {
  statusCode: number;
  message: string;
  data: User;
}

export interface User {
  id?: string;
  key?: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  status: string;
  user_permissions?: Array<UserPermission>;
  createdAt?: string;
  updatedAt?: string;
}
