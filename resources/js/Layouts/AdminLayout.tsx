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
  background: `
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.24), transparent 42%),
    radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.18), transparent 38%),
    linear-gradient(180deg, #1e3a8a 0%, #1e2a68 48%, #16224f 100%)
  `,
  borderRight: '1px solid rgba(191, 219, 254, 0.24)',
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
  const currentRoute = `${route().current() ?? ''}`;
  const userInitials = `${user?.fname?.[0] ?? ''}${user?.lname?.[0] ?? ''}`.toUpperCase();
  const fullName = `${user?.lname ?? ''}, ${user?.fname ?? ''}`.trim();
  const compactName = `${user?.lname ?? ''}, ${user?.fname?.[0] ?? ''}.`.trim();
  const pageTitle = currentMenuKey === 'admin.dashboard'
    ? 'Dashboard'
    : currentMenuKey === 'admin.categories'
      ? 'Categories'
      : currentMenuKey === 'admin.regions'
        ? 'Regions'
        : currentMenuKey === 'admin.materials'
          ? 'Materials'
          : currentMenuKey === 'admin.ojt-materials'
            ? 'OJT Entry Materials'
            : currentMenuKey === 'admin.trash-articles'
              ? 'Trash Materials'
              : currentMenuKey === 'admin.users'
                ? 'Users'
                : currentRoute.startsWith('my-account')
                  ? 'My Account'
                  : currentRoute.startsWith('change-password')
                    ? 'Change Password'
                    : 'Admin Panel';

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
          <div className='border-b border-blue-100/25 pb-3'>
            <PanelSideBarLogo />
            {!collapsed && (
              <div className='mx-4 mt-1 rounded-xl border border-blue-100/25 bg-white/10 px-3 py-2 text-blue-50 backdrop-blur-[1px]'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-100/90'>Admin Workspace</p>
                <div className='mt-1 flex items-center gap-2'>
                  <div className='inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-100/35 bg-blue-200/20 text-[11px] font-semibold'>
                    {userInitials || 'AD'}
                  </div>
                  <p className='truncate text-xs text-blue-50/90'>{user.lname}, {user.fname}</p>
                </div>
              </div>
            )}
          </div>
          <ConfigProvider
            theme={{
              token: {
                colorText: '#eff6ff',
                colorBgBase: '#1e3a8a',
                colorBgContainer: '#1e3a8a',
              },
              components: {
                Menu: {
                  itemBg: 'transparent',
                  itemColor: 'rgba(239,246,255,0.86)',
                  itemHoverColor: '#ffffff',
                  itemHoverBg: 'rgba(96, 165, 250, 0.18)',
                  itemSelectedColor: '#ffffff',
                  itemSelectedBg: 'rgba(37, 99, 235, 0.42)',
                  subMenuItemBg: 'transparent',
                  itemBorderRadius: 10,
                  iconSize: 15,
                },
              }
            }}
          >
            <Menu
              mode="inline"
              style={{
                background: 'transparent',
                color: '#eff6ff',
                borderInlineEnd: 0,
                paddingInline: 8,
                paddingTop: 8,
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
            <div className='flex h-16 items-center justify-between px-3'>
              <div className='flex items-center gap-3'>
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  aria-label="Toggle sidebar"
                  style={{
                    fontSize: '16px',
                    width: 42,
                    height: 42,
                  }}
                />
                <div className='h-7 w-px bg-slate-200' />
                <div className='leading-tight'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500'>Admin Workspace</p>
                  <p className='text-sm font-semibold text-slate-800'>{pageTitle}</p>
                </div>
              </div>
              <div className='flex items-center'>
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
                    className='inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50'
                    title={fullName}
                  >
                    <Avatar size="small" style={{ backgroundColor: '#1d4ed8' }}>{userInitials || 'AD'}</Avatar>
                    <span className='max-w-[140px] truncate font-medium lg:max-w-[190px]'>{compactName}</span>
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
