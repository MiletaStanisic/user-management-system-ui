import { Button, Col, Form, Input, notification, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import PageLayout from '../../components/Layout/Layout';
import { User } from '../../types/users';
import * as usersApi from '../../api/users';
import { useNavigate } from 'react-router-dom';

const CreateUser = (): JSX.Element => {
  const navigate = useNavigate();
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (data: User): Promise<void> => {
    const { firstName, lastName, email, status, password, username } = data;
    setIsLoading(true);
    try {
      const payload = {
        firstName,
        lastName,
        email,
        status,
        password,
        username,
      };
      await usersApi.createUser(payload);
      notification.success({
        message: 'User succesfully created',
      });
      navigate('/');
    } catch (error) {
      notification.error({
        message: 'An error occured while creating user',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <Row>
        <Col span={12} offset={6}>
          <Form form={form} layout='vertical' onFinish={handleSubmit}>
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
              name='username'
              label='Username'
              rules={[{ required: true, type: 'string' }]}
            >
              <Input placeholder='Enter username' />
            </Form.Item>
            <Form.Item
              name='password'
              label='Password'
              rules={[{ required: true, type: 'string' }]}
            >
              <Input.Password placeholder='Enter password' />
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
              Create
            </Button>
          </Form>
        </Col>
      </Row>
    </PageLayout>
  );
};

export default CreateUser;
