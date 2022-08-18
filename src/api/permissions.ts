import { Permission, PermissionResponse } from '../types/permissions';
import { api } from './utils';

export const getPermissions = async (): Promise<Array<Permission>> => {
  const url = `/permissions`;

  const response = await api.get(url);
  const data: PermissionResponse = await response.json();

  return data.data
}
