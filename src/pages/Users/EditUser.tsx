import { Button, Col, Form, Input, notification, Result, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as usersApi from '../../api/users';
import PageLayout from '../../components/Layout/Layout';
import { User } from '../../types/users';

const EditUser = (): JSX.Element => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const params = useParams();
  const { userId } = params;
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userId) {
      void fetchUserDetails(userId);
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

  const getInitialValues = () => {
    if (user) {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
      };
    }
  };

  const handleSubmit = async (data: User): Promise<void> => {
    const { firstName, lastName, email, status } = data;
    setIsLoading(true);
    try {
      const payload = {
        ...user!,
        firstName,
        lastName,
        email,
        status,
      };
      await usersApi.updateUser(userId!, payload);
      notification.success({
        message: 'User succesfully updated',
      });
      navigate('/');
    } catch (error) {
      notification.error({
        message: 'An error occured while updating user',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <PageLayout>
      <Row>
        <Col span={12} offset={6}>
          {user ? (
            <Form
              key={user ? user.id : 'form-key'}
              form={form}
              layout='vertical'
              initialValues={getInitialValues()}
              onFinish={handleSubmit}
            >
              <Form.Item
                name='firstName'
                label='First Name'
                rules={[{ required: true, type: 'string' }]}
              >
                <Input placeholder='Enter first name' />
              </Form.Item>
              <Form.Item
                name='lastName'
                label='Last Name'
                rules={[{ required: true, type: 'string' }]}
              >
                <Input placeholder='Enter last name' />
              </Form.Item>
              <Form.Item
                name='email'
                label='Email'
                rules={[{ required: true, type: 'email' }]}
              >
                <Input type='email' placeholder='Enter email' />
              </Form.Item>
              <Form.Item
                name='status'
                label='Status'
                rules={[{ required: true, type: 'string' }]}
              >
                <Input placeholder='Enter status' />
              </Form.Item>
              <Button
                htmlType='submit'
                loading={isLoading}
                disabled={isLoading}
                type='primary'
              >
                Save changes
              </Button>
            </Form>
          ) : (
            <Result status='404' title='404' subTitle='User not found.' />
          )}
        </Col>
      </Row>
    </PageLayout>
  );
};

export default EditUser;
