import React from 'react';
import { Layout, Menu } from 'antd';
import './Layout.css';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

interface PageLayoutProps {
  children: React.ReactNode;
}
const PageLayout = ({ children }: PageLayoutProps): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Layout className='layout'>
      <Header>
        <div className='logo' />
        <Menu
          theme='dark'
          mode='horizontal'
          items={[
            {
              label: 'User Management System',
              key: 'home',
              onClick: () => navigate('/'),
            },
          ]}
        />
      </Header>
      <Content>
        <div className='site-layout-content'>{children}</div>
      </Content>
    </Layout>
  );
};

export default PageLayout;
