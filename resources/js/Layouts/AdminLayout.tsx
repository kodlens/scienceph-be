import { useMemo, useState, PropsWithChildren } from 'react';
import { router, useForm } from '@inertiajs/react';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined, ProfileOutlined,
  FormOutlined,
  DashboardOutlined,
  DownOutlined
} from '@ant-design/icons';

import { Avatar, Button, ConfigProvider, Dropdown, Layout, Menu, MenuProps } from 'antd';
import PanelSideBarLogo from '@/Components/PanelSideBarLogo';
import { DatabaseZap, LandPlot, LogOut, UserPen } from 'lucide-react';
const { Header, Sider, Content } = Layout;

const siderStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, #084c7f 0%, #06385d 100%)',
};

export default function AdminLayout(
  { user, children }: PropsWithChildren<{ user: any }>) {

  const { post } = useForm();

  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>(['materials']);

  const handleLogout = () => {
    post(route('logout'));
  }

  type MenuItem = Required<MenuProps>['items'][number];

  const currentMenuKey = `${route().current()?.split('.')?.slice(0, -1).join('.')}`;

  const navigationItems = useMemo<MenuItem[]>(() => ([
    {
      key: 'admin.dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => router.visit('/admin/dashboard'),
    },
    {
      key: 'admin.categories',
      icon: <ProfileOutlined />,
      label: 'Categories',
      onClick: () => router.visit('/admin/categories'),
    },
    {
      key: 'admin.regions',
      icon: <LandPlot size={15} />,
      label: 'Regions',
      onClick: () => router.visit('/admin/regions'),
    },
    {
      type: 'divider',
    },
    {
      key: 'materials',
      icon: <FormOutlined />,
      label: 'Materials',
      children: [
        {
          key: 'admin.materials',
          label: 'Materials',
          icon: <FormOutlined />,
          onClick: () => router.visit('/admin/materials'),
        },
        {
          key: 'admin.ojt-materials',
          label: 'OJT Entry Materials',
          icon: <UserPen size={15} />,
          onClick: () => router.visit('/admin/ojt-materials'),
        },
        {
          key: 'admin.trash-articles',
          label: 'Trash Post/Article',
          icon: <DatabaseZap size={15} />,
          onClick: () => router.visit('/admin/trash-materials'),
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
      onClick: () => router.visit('/admin/users'),
    },
  ]), []);

  return (
    <>
      <Layout>
        <Sider trigger={null}
          style={siderStyle}
          collapsible
          collapsed={collapsed} width={260}
          breakpoint='md'
          onBreakpoint={(broken) => {
            setCollapsed(broken)
            if (!broken) setOpenKeys(['materials'])
          }}>
          <PanelSideBarLogo />
          <ConfigProvider
            theme={{
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
            }}
          >
            <Menu
              mode="inline"
              style={{
                background: 'transparent',
                color: 'white',
                borderInlineEnd: 0,
              }}
              selectedKeys={[currentMenuKey]}
              openKeys={collapsed ? [] : openKeys}
              onOpenChange={(keys) => setOpenKeys(keys as string[])}
              items={navigationItems}
            />
          </ConfigProvider>


        </Sider>
        <Layout>
          <Header
            className='border-b border-slate-200'
            style={{ padding: 0, background: 'white' }}
          >
            <div className='flex items-center'>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                aria-label="Toggle sidebar"
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              <div className='ml-auto mr-4 flex items-center gap-3'>
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: [
                      {
                        key: 'logout',
                        danger: true,
                        icon: <LogOut size={14} />,
                        label: 'Logout',
                        onClick: handleLogout,
                      },
                    ],
                  }}
                >
                  <button
                    type='button'
                    className='inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50'
                  >
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span className='font-medium'>{user.lname}, {user.fname}</span>
                    <DownOutlined className='text-xs text-slate-500' />
                  </button>
                </Dropdown>
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
