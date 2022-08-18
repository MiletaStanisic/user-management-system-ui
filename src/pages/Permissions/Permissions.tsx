import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../../components/Layout/Layout';
import * as usersApi from '../../api/users';
import * as permissionsApi from '../../api/permissions';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import * as userPermissionsApi from '../../api/userPermissions';
import { User } from '../../types/users';
import {
  Checkbox,
  Col,
  Descriptions,
  notification,
  Result,
  Row,
  Select,
  Tag,
} from 'antd';
import { Permission } from '../../types/permissions';
import './Permissions.css';

const Permissions = (): JSX.Element => {
  const params = useParams();
  const { userId } = params;
  const [user, setUser] = useState<User>();
  const [permissions, setPermissions] = useState<Array<Permission>>([]);

  useEffect(() => {
    if (userId) {
      void fetchUserDetails(userId);
      void fetchPermissions();
    }
  }, [userId]);

  const fetchUserDetails = async (userId: string): Promise<void> => {
    try {
      const user = await usersApi.getUser(userId);
      setUser(user);
    } catch (error) {
      notification.error({
        message: 'An error occured while fetching data.',
      });
    }
  };

  const fetchPermissions = async (): Promise<void> => {
    try {
      const permissions = await permissionsApi.getPermissions();
      setPermissions(permissions);
    } catch (error) {
      notification.error({
        message: 'An error occured while fetching permissions',
      });
    }
  };

  const handleUpdatePermission = async (
    event: CheckboxChangeEvent,
  ): Promise<void> => {
    if (event.target.checked) {
      try {
        await userPermissionsApi.assignPermission({
          userId: userId!,
          permissionId: event.target.value,
        });

        await fetchUserDetails(userId!);
        notification.success({
          message: 'Permission sucessfully assigned!',
        });
      } catch (error) {
        notification.error({
          message: 'An error occured. Please try again.',
        });
      }
    } else {
      try {
        await userPermissionsApi.unassignPermission(userId!, {
          permissionId: event.target.value,
        });

        await fetchUserDetails(userId!);
        notification.success({
          message: 'Permission sucessfully unassigned!',
        });
      } catch (error) {
        notification.error({
          message: 'An error occured. Please try again.',
        });
      }
    }
  };

  return (
    <PageLayout>
      <Row className='permission-page'>
        <Col span={16} offset={4}>
          {user ? (
            <React.Fragment>
              <Descriptions
                layout='horizontal'
                column={1}
                bordered
                title='User information'
              >
                <Descriptions.Item label='First name'>
                  {user.firstName}
                </Descriptions.Item>
                <Descriptions.Item label='Last name'>
                  {user.lastName}
                </Descriptions.Item>
                <Descriptions.Item label='Email'>
                  {user.email}
                </Descriptions.Item>
                <Descriptions.Item label='Status'>
                  {user.status}
                </Descriptions.Item>
                <Descriptions.Item label='Permissions'>
                  {user.user_permissions && user.user_permissions ? (
                    user.user_permissions.map((userPermission) => (
                      <Tag key={userPermission.id} color='geekblue'>
                        {userPermission.permission.code}
                      </Tag>
                    ))
                  ) : (
                    <Tag color='red'>None</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
              <div className='checkbox-wrapper'>
                {permissions.map((permission) => (
                  <Checkbox
                    key={permission.id}
                    value={permission.id}
                    checked={
                      user.user_permissions &&
                      user.user_permissions.some(
                        (p) => p.permissionId === permission.id,
                      )
                    }
                    onChange={handleUpdatePermission}
                  >
                    {permission.code}
                  </Checkbox>
                ))}
              </div>
            </React.Fragment>
          ) : (
            <Result status='404' title='404' subTitle='User not found.' />
          )}
        </Col>
      </Row>
    </PageLayout>
  );
};

export default Permissions;
