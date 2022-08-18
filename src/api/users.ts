import { QueryParams } from '../types/general';
import { User, UserListResponse, UserResponse } from '../types/users';
import { api } from './utils';

export const getUsers = async (
  params?: QueryParams,
): Promise<{
  count: number;
  users: Array<User>;
}> => {
  const url = `/users`;
  const response = await api.get(url, params);
  const data: UserListResponse = await response.json();

  const {
    data: { rows: users, count },
  } = data;

  return {
    users,
    count,
  };
};

export const getUser = async (userId: string): Promise<User | undefined> => {
  const url = `/users/${userId}`;

  const response = await api.get(url);
  const data: UserResponse = await response.json();
  return data.data;
};

export const createUser = async (payload: User): Promise<User> => {
  const url = `/users`;

  const response = await api.post(url, payload);
  const data: UserResponse = await response.json();
  return data.data;
};

export const updateUser = async (
  userId: string,
  payload: User,
): Promise<User> => {
  const url = `/users/${userId}`;

  const response = await api.put(url, payload);
  const data: UserResponse = await response.json();
  return data.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const url = `/users/${userId}`;
  await api.delete(url);
};
