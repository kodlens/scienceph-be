import { useState, PropsWithChildren } from 'react';
import { Link, router, useForm } from '@inertiajs/react';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined, ProfileOutlined,
  FormOutlined,
  BarsOutlined,
  DashboardOutlined,
  PlusOutlined
} from '@ant-design/icons';

import { Button, ConfigProvider, Layout, Menu, MenuProps } from 'antd';
import PanelSideBarLogo from '@/Components/PanelSideBarLogo';
import { DatabaseZap, LogOut, UserPen } from 'lucide-react';
const { Header, Sider, Content } = Layout;

const siderStyle: React.CSSProperties = {

  background: "#084c7f",

};

export default function AdminLayout(
  { user, children }: PropsWithChildren<{ user: any }>) {

  const { post } = useForm();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    post(route('logout'));
  }

  type MenuItem = Required<MenuProps>['items'][number];

  const navigationItems = () => {

    const items: MenuItem[] = [];

    items.push({
      key: 'admin.dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => router.visit('/admin/dashboard')
    },
    {
      key: 'admin.categories',
      icon: <ProfileOutlined />,
      label: 'Categores',
      onClick: () => router.visit('/admin/categories')

    },
    {
      key: 'admin.sections',
      icon: <BarsOutlined />,
      label: 'Sections',
      onClick: () => router.visit('/admin/sections')
    },
    {
      key: 'admin.regions',
      icon: <BarsOutlined />,
      label: 'Regions',
      onClick: () => router.visit('/admin/regions')
    },
    {
      key: 'admin.regional-offices',
      icon: <BarsOutlined />,
      label: 'Regional Offices',
      onClick: () => router.visit('/admin/regional-offices')
    },
    {
      type: 'divider',
    },
    {
      key: 'admin.articles',
      icon: <FormOutlined />,
      label: 'Articles',
      children: [
        {
          key: 'admin.articles.create',
          label: 'New Post/Article',
          icon: <PlusOutlined  />,
          onClick: () => router.visit('/admin/articles/create'),
        },
        {
          key: 'admin.articles.index',
          label: 'Articles',
          icon: <FormOutlined />,
          onClick: () => router.visit('/admin/articles'),
        },
        {
          key: 'admin.ojt-articles.index',
          label: 'OJT Entry Articles',
          icon: <UserPen size={15}/>,
          onClick: () => router.visit('/admin/ojt-articles'),
        },
        {
          key: 'admin.articles.trash',
          label: 'Trash Post/Article',
          icon: <DatabaseZap size={15} />,
          onClick: () => router.visit('/admin/article-trashes'),
        },

      ],
    },
    {
      type: 'divider'
    },

    {
      key: 'admin.users',
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => router.visit('/admin/users')
    });

    return items;
  }


  return (
    <>
      <Layout>
        <Sider trigger={null}
          style={siderStyle}
          collapsible
          collapsed={collapsed} width={300}
          breakpoint='md'
          onBreakpoint={(broken) => {
            setCollapsed(broken)
          }}>
          <PanelSideBarLogo />
          <ConfigProvider
            theme={{
              token: {
                /* here is your global tokens */
                colorText: 'white',
                colorBgBase: '#084c7f',
                //colorBgTextHover : 'red' //bg color when hovering the menu
                //colorBgElevated: 'red' //can be use also as bg color in mobile sub link
                colorLinkActive: 'red'
              },
            }}
          >
            <Menu
              mode="inline"
              style={{
                background: "#084c7f",
                color: 'white',
              }}
              defaultSelectedKeys={[`${route().current()?.split('.')?.slice(0, -1).join('.')}`]}
              defaultOpenKeys={['admin.articles']}
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
                <Button
                  danger
                  onClick={handleLogout}
                  icon={<LogOut size={16} />}>
                </Button>
              </div>

            </div>
          </Header>
          <Content
            style={{
              margin: 0,
              padding: 0,
              height: 'calc(100vh - 64px)', // 100vh',
              background: "#dce6ec",
              overflow: 'auto',
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
