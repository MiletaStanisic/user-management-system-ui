import React, { useEffect, useState } from 'react';
import { User } from '../../types/users';
import * as usersApi from '../../api/users';
import {
  Modal,
  TablePaginationConfig,
  Table,
  notification,
  Tag,
  Row,
  Col,
  Button,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import type {
  ColumnsType,
  FilterValue,
  SorterResult,
} from 'antd/es/table/interface';
import './Home.css';
import { QueryParams } from '../../types/general';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/Layout/Layout';
import moment from 'moment';

const Home = (): JSX.Element => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const getParams = (
    pagination: TablePaginationConfig,
    sortKey: string = 'createdAt',
    sortOrder: string = 'DESC',
  ): QueryParams => {
    return {
      limit: pagination.pageSize,
      page: pagination.current! - 1,
      sortKey,
      sortOrder,
    };
  };

  useEffect(() => {
    const params = getParams(pagination);
    void fetchUsers(params);
  }, []);

  const fetchUsers = async (params: QueryParams): Promise<void> => {
    setIsLoading(true);
    try {
      const { count, users } = await usersApi.getUsers(params);
      setUsers(
        users.map((user) => ({
          key: user.id,
          ...user,
        })),
      );
      setPagination((state) => ({
        ...state,
        total: count,
      }));
    } catch (error) {
      notification.error({
        message: 'An error occured while fetching users.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await usersApi.deleteUser(userId);
      const params = getParams(pagination);
      await fetchUsers(params);
      notification.success({
        message: 'User deleted!',
      });
    } catch (error) {
      notification.error({
        message: 'An error occured while deleting user',
      });
    }
  };

  const showConfirmationModal = (userId: string): void => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this user?',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: () => handleDeleteUser(userId),
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      ellipsis: true,
      sorter: true,
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      ellipsis: true,
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true,
      sorter: true,
    },
    {
      title: 'Permissions',
      dataIndex: 'user_permissions',
      key: 'user_permissions',
      render: (text, record) =>
        record &&
        record.user_permissions &&
        record.user_permissions.length > 0 ? (
          record.user_permissions.map((userPermission) => (
            <Tag key={userPermission.id} color='geekblue'>
              {userPermission.permission.code}
            </Tag>
          ))
        ) : (
          <Tag color='red'>None</Tag>
        ),
    },
    {
      title: 'Date created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      ellipsis: true,
      sorter: true,
      render: (text) => moment(text).format('YYYY-MM-DDTHH:mm'),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center',
      render: (value: string, record: User) => (
        <div>
          <Link to={`/user/${record.id}`}>Edit</Link>
          <a
            onClick={() => showConfirmationModal(record.id!)}
            style={{ color: 'red', marginLeft: '8px', marginRight: '8px' }}
          >
            Delete
          </a>
          <Link to={`/permissions/user/${record.id}`}>Assign</Link>
        </div>
      ),
    },
  ];

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[],
  ) => {
    const sortKey = Array.isArray(sorter) ? sorter[0].field : sorter.field;
    const order = Array.isArray(sorter) ? sorter[0].order : sorter.order;
    const sortOrder = (order as string) === 'ascend' ? 'ASC' : 'DESC';
    const params = getParams(newPagination, sortKey as string, sortOrder);
    setPagination(newPagination);
    fetchUsers(params);
  };

  return (
    <PageLayout>
      <div className='home-container'>
        <Row>
          <Col>
            <Link to='/user'>
              <Button
                type='primary'
                size='large'
                style={{ marginBottom: '16px' }}
              >
                + New user
              </Button>
            </Link>
          </Col>
        </Row>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={users}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
    </PageLayout>
  );
};

export default Home;
