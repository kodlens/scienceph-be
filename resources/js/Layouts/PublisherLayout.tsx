import { useMemo, useState, PropsWithChildren, ReactNode } from 'react';
import { router, useForm } from '@inertiajs/react';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined, LockOutlined,
  MenuOutlined, DownOutlined
} from '@ant-design/icons';

import { Avatar, Button, ConfigProvider, Dropdown, Layout, Menu, MenuProps } from 'antd';
import PanelSideBarLogo from '@/Components/PanelSideBarLogo';
import { BookCheck, LogOut, Newspaper, SendHorizontal } from 'lucide-react';
const { Header, Sider, Content } = Layout;

const siderStyle: React.CSSProperties = {
  background: `
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.24), transparent 42%),
    radial-gradient(circle at bottom left, rgba(20, 184, 166, 0.18), transparent 38%),
    linear-gradient(180deg, #0f3e57 0%, #0a2f45 48%, #07293d 100%)
  `,
  borderRight: '1px solid rgba(148, 210, 228, 0.22)',
};

export default function PublisherLayout(
  { user, children }: PropsWithChildren<{ user: any, header?: ReactNode }>) {

  const { post } = useForm();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>(['publisher.materials']);

  const handleLogout = () => {
    post(route('logout'));
  }

  type MenuItem = Required<MenuProps>['items'][number];
  const navigationItems = useMemo<MenuItem[]>(() => ([
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
      key: 'publisher.materials',
      icon: <MenuOutlined />,
      label: 'Materials',
      children: [
        {
          key: 'publisher.draft-materials.index',
          label: 'Draft',
          icon: <Newspaper size={15} />,
          onClick: () => router.visit('/publisher/draft-materials'),
        },
        {
          key: 'publisher.submitted-materials.index',
          label: 'Submitted',
          icon: <SendHorizontal size={15} />,
          onClick: () => router.visit('/publisher/submitted-materials'),
        },
        {
          key: 'publisher.publish-materials.index',
          label: 'Published',
          icon: <BookCheck size={15} />,
          onClick: () => router.visit('/publisher/publish-materials'),
        },
        // {
        //   key: 'publisher.ojt-materials.index',
        //   label: 'Ojt Materials',
        //   icon: <BookCheck size={15} />,
        //   onClick: () => router.visit('/publisher/ojt-materials'),
        // },
        // {
        //   key: 'publisher.trash-materials.index',
        //   label: 'Trash',
        //   icon: <DatabaseZap size={15} />,
        //   onClick: () => router.visit('/publisher/trash-materials'),
        // },
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

  const selectedMenuKey = currentRoute.startsWith('publisher.materials.')
    ? 'publisher.materials.index'
    : currentRoute.startsWith('publisher.trash-materials')
      ? 'publisher.trash-materials.index'
      : currentRoute;

  const userInitials = `${user?.fname?.[0] ?? ''}${user?.lname?.[0] ?? ''}`.toUpperCase();
  const fullName = `${user?.lname ?? ''}, ${user?.fname ?? ''}`.trim();
  const compactName = `${user?.lname ?? ''}, ${user?.fname?.[0] ?? ''}.`.trim();
  const pageTitle = currentRoute === 'publisher.dashboard.index'
    ? 'Dashboard'
    : currentRoute.startsWith('publisher.materials')
      ? 'Materials'
      : currentRoute.startsWith('publisher.trash-materials')
        ? 'Trash Materials'
        : currentRoute === 'my-account.index'
          ? 'My Account'
          : currentRoute === 'change-password.index'
            ? 'Change Password'
            : 'Publisher Panel';

  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible
          style={siderStyle}
          breakpoint='md'
          onBreakpoint={(broken) => {
            setCollapsed(broken);
            if (!broken) setOpenKeys(['publisher.materials']);
          }}
          collapsed={collapsed} width={260}>
          <div className='border-b border-cyan-100/20 pb-3'>
            <PanelSideBarLogo />
            {!collapsed && (
              <div className='mx-4 mt-1 rounded-xl border border-cyan-100/20 bg-white/10 px-3 py-2 text-cyan-50 backdrop-blur-[1px]'>
                <p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100/90'>Publisher Workspace</p>
                <div className='mt-1 flex items-center gap-2'>
                  <div className='inline-flex h-7 w-7 items-center justify-center rounded-full border border-cyan-100/35 bg-cyan-200/20 text-[11px] font-semibold'>
                    {userInitials || 'PU'}
                  </div>
                  <p className='truncate text-xs text-cyan-50/90'>{user.lname}, {user.fname}</p>
                </div>
              </div>
            )}
          </div>
          <ConfigProvider theme={{
            token: {
              colorText: '#e6f7ff',
              colorBgBase: '#0f3e57',
              colorBgContainer: '#0f3e57',
            },
            components: {
              Menu: {
                itemBg: 'transparent',
                itemColor: 'rgba(230,247,255,0.86)',
                itemHoverColor: '#ffffff',
                itemHoverBg: 'rgba(103, 232, 249, 0.16)',
                itemSelectedColor: '#ffffff',
                itemSelectedBg: 'rgba(20, 184, 166, 0.34)',
                subMenuItemBg: 'transparent',
                itemBorderRadius: 10,
                iconSize: 15,
              },
            }
          }}>
            <Menu
              mode="inline"
              style={{
                background: 'transparent',
                color: '#e6f7ff',
                borderInlineEnd: 0,
                paddingInline: 8,
                paddingTop: 8,
              }}
              selectedKeys={[selectedMenuKey]}
              openKeys={collapsed ? [] : openKeys}
              onOpenChange={(keys) => setOpenKeys(keys as string[])}
              defaultOpenKeys={['publisher.materials']}
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
                  style={{
                    fontSize: '16px',
                    width: 42,
                    height: 42,
                  }}
                />
                <div className='h-7 w-px bg-slate-200' />
                <div className='leading-tight'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500'>Publisher Workspace</p>
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
                    <Avatar size="small" style={{ backgroundColor: '#0f766e' }}>{userInitials || 'PU'}</Avatar>
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
              height: 'calc(100vh - 64px)',
              overflow: 'auto',
              background: "#dce6ec",
              borderRadius: 0,
            }}
          >
            <main className='py-6 px-4'>{children}</main>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
