import { useState, PropsWithChildren, ReactNode } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined, FormOutlined, LockOutlined,
  MenuOutlined
} from '@ant-design/icons';

import { Button, ConfigProvider, Layout, Menu, MenuProps } from 'antd';
import PanelSideBarLogo from '@/Components/PanelSideBarLogo';
import { DatabaseZap, LogOut } from 'lucide-react';
const { Header, Sider, Content } = Layout;


export default function PublisherLayout(
  { user, children }: PropsWithChildren<{ user: any, header?: ReactNode }>) {

  const { post } = useForm();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    post(route('logout'));
  }

  type MenuItem = Required<MenuProps>['items'][number];
  const navigationItems = () => {

    const items: MenuItem[] = [];

    items.push(
      {
        key: 'publisher.dashboard.index',
        icon: <UserOutlined />,
        label: 'Dashboard',
        onClick: () => router.visit('/publisher/dashboard')
      },
      {
        type: 'divider',
      },
      {
        key: 'publisher.articles',
        icon: <MenuOutlined  />,
        label: 'Articles',
        children: [
          {
            key: 'publisher.articles.index',
            label: 'Articles',
            icon: <FormOutlined />,
            onClick: () => router.visit('/publisher/articles'),
          },
          {
            key: 'publisher.trash-articles.index',
            label: 'Trash Post/Article',
            icon: <DatabaseZap size={15} />,
            onClick: () => router.visit('/publisher/trash-articles'),
          },
        ],
      },
      // {
      //   key: 'publisher.posts-publish',
      //   icon: <CreditCardOutlined />,
      //   label: 'Publish',
      //   onClick: () => router.visit('/publisher/post-publish')
      // },
      // {
      //   key: 'publisher.posts-unpublish',
      //   icon: <MinusSquareOutlined />,
      //   label: 'Unpublish',
      //   onClick: () => router.visit('/publisher/post-unpublish')
      // },
      {
        type: 'divider'
      },
      {
        key: 'my-account.index',
        icon: <UserOutlined />,
        label: 'My Account',
        onClick: () => router.visit('/my-account')

      },
      {
        key: 'change-password.index',
        icon: <LockOutlined />,
        label: 'Change Password',
        onClick: () => router.visit('/change-password')

      },
    );

    // items.push({
    // 	key: 'panel.publisher-dashboard',
    //     icon: <UserOutlined />,
    //     label: 'Dashboard',
    //     onClick: () => router.visit('/panel/publisher/dashboard')
    // });

    // if (paramPermissions.includes('posts.index')) {
    // 	items.push({
    //         type: 'divider',
    //     },
    //     {
    //         key: 'posts.index',
    //         icon: <FormOutlined />,
    //         label: 'Posts',
    //         onClick: ()=> router.visit('/panel/posts')
    //     });
    // }

    // if (paramPermissions.includes('trashes.index')) {

    // }

    return items;
  }


  return (

    <>
      <Layout>
        <Sider trigger={null} collapsible
          breakpoint='md'
          onBreakpoint={(b) => setCollapsed(b)}
          collapsed={collapsed} width={300} style={{ background: "#084c7f" }}>
          <PanelSideBarLogo />
          <ConfigProvider theme={{
            token: {
              colorText: 'white',
              colorBgBase: '#084c7f',
            }
          }}>
            <Menu
              mode="inline"
              style={{
                background: "#084c7f",
                color: 'white',
              }}
              defaultOpenKeys={['publisher.articles']}
              defaultSelectedKeys={[`${route().current()}`]}
              items={
                navigationItems()
              }
            />

          </ConfigProvider>
        </Sider>
        <Layout>
          <Header
            className='border'
            style={{ padding: 0, background: 'white' }}
          >
            <div className='flex items-center'>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />


              <div className='ml-auto mr-4 flex items-center gap-4'>
                <Link href=''>{user.lname} {user.fname[0]}.</Link>
                <Button className='' danger onClick={handleLogout}>
                  <LogOut size={15} />
                </Button>
              </div>

            </div>
          </Header>
          <Content
            style={{
              margin: 0,
              padding: 0,
              height: 'calc(100vh - 64px)',
              overflow: 'auto',
              background: "#dce6ec",
              borderRadius: 0,
            }}
          >
            <main className='py-4'>{children}</main>
          </Content>
        </Layout>
      </Layout>
    </>


  );
}
