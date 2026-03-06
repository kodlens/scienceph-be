import { useMemo, useState, PropsWithChildren, ReactNode } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { User } from '@/types';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  FormOutlined, UserOutlined, LockOutlined
} from '@ant-design/icons';

import { Button, ConfigProvider, Layout, Menu, MenuProps } from 'antd';
import PanelSideBarLogo from '@/Components/PanelSideBarLogo';
import { LogOut } from 'lucide-react';
const { Header, Sider, Content } = Layout;

const siderStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, #084c7f 0%, #06385d 100%)',
};

export default function EncoderLayout(
  { user, children }: PropsWithChildren<{ user: User, header?: ReactNode }>) {

  const { post } = useForm();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>(['encoder.materials']);

  const handleLogout = () => {
    post(route('logout'));
  }

  type MenuItem = Required<MenuProps>['items'][number];
  const navigationItems = useMemo<MenuItem[]>(() => ([
    {
        key: 'encoder.dashboard.index',
        icon: <HomeOutlined />,
        label: 'Dashboard',
        onClick: () => router.visit('/encoder/dashboard')
    },
    {
        key: 'encoder.materials',
        icon: <FormOutlined />,
        label: 'Materials',
        children: [
          {
            key: 'encoder.materials.index',
            label: 'Materials',
            onClick: () => router.visit('/encoder/materials'),
          },
          {
            key: 'encoder.materials.create',
            label: 'New Post/Material',
            onClick: () => router.visit('/encoder/materials/create'),
          },

        ],
    },
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
  ]), []);

  const currentRoute = `${route().current() ?? ''}`;
  const selectedMenuKey = currentRoute.startsWith('encoder.materials.')
    ? (currentRoute === 'encoder.materials.index' || currentRoute === 'encoder.materials.create'
      ? currentRoute
      : 'encoder.materials.index')
    : currentRoute;


  return (

    <>
      <Layout>
        <Sider trigger={null} collapsible
          style={siderStyle}
          breakpoint='md'
          onBreakpoint={(broken) => {
            setCollapsed(broken);
            if (!broken) setOpenKeys(['encoder.materials']);
          }}
          collapsed={collapsed} width={260}>
          <PanelSideBarLogo />
          <ConfigProvider theme={{
            token: {
              colorText: 'white',
              colorBgBase: '#084c7f',
              colorBgContainer: '#084c7f',
            },
            components: {
              Menu: {
                itemBg: 'transparent',
                itemColor: 'rgba(255,255,255,0.88)',
                itemHoverColor: '#ffffff',
                itemHoverBg: 'rgba(255,255,255,0.14)',
                itemSelectedColor: '#ffffff',
                itemSelectedBg: 'rgba(255,255,255,0.22)',
                subMenuItemBg: 'transparent',
              },
            }
          }}>
            <Menu
              mode="inline"
              style={{
                background: 'transparent',
                color: 'white',
                borderInlineEnd: 0,
              }}
              selectedKeys={[selectedMenuKey]}
              openKeys={collapsed ? [] : openKeys}
              onOpenChange={(keys) => setOpenKeys(keys as string[])}
              items={navigationItems}
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
