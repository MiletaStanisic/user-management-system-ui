export interface PermissionResponse {
  statusCode: number;
  message: string;
  data: Array<Permission>;
}

export interface UserPermission {
  id: string;
  userId: string;
  permissionId: string;
  permission: Permission;
}

export interface Permission {
  id: string;
  code: string;
  description: string;
}
