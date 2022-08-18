import { UserPermission } from '../types/permissions';
import { api } from './utils';

export const assignPermission = async (payload: {
  userId: string;
  permissionId: string;
}): Promise<UserPermission> => {
  const url = `/user-permission`;

  const response = await api.post(url, payload);
  const data = await response.json();

  return data.data;
};

export const unassignPermission = async (
  userId: string,
  payload: {
    permissionId: string;
  },
): Promise<void> => {
  const url = `/user-permission/${userId}`;

  await api.delete(url, payload);
};
