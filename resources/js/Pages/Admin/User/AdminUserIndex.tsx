import { useState } from 'react'
import axios from 'axios'
import { Head } from '@inertiajs/react'
import {
  FileAddOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons'
import {
  Table,
  Space,
  Pagination,
  Button,
  Modal,
  Form,
  Input,
  Select,
  App,
} from 'antd'

import AdminLayout from '@/Layouts/AdminLayout'
import ChangePassword from './partials/ChangePassword'
import { User } from '@/types'
import { useQuery } from '@tanstack/react-query'

const { Column } = Table



const AdminUserIndex = () => {
  const [form] = Form.useForm()
  const { notification } = App.useApp()

  const [open, setOpen] = useState(false)
  const [id, setId] = useState<number>(0)

  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [search, setSearch] = useState<string>('')

  /* ===================== DATA ===================== */

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {

      const params = [
        `perpage=${perPage}`,
        `page=${page}`,
        `search=${search}`,
      ].join('&')

      const res = await axios.get(`/admin/get-users?${params}`)
      return res.data
    }

  })

  /* ===================== ACTIONS ===================== */

  const handleNew = () => {
    setId(0)
    setErrors({})
    form.resetFields()
    setOpen(true)
  }

  const handleEdit = async (userId: number) => {
    setId(userId)
    setErrors({})
    setOpen(true)

    const res = await axios.get<User>(`/admin/users/${userId}`)
    form.setFieldsValue(res.data)
  }

  const handleDelete = async (userId: number) => {
    const res = await axios.delete(`/admin/users/${userId}`)
    if (res.data.status === 'deleted') {
      notification.success({
        message: 'Deleted',
        description: 'User removed successfully',
      })
      refetch()
    }
  }

  /* ===================== SUBMIT ===================== */

  const onFinish = async (values: User) => {
    try {
      if (id > 0) {
        await axios.put(`/admin/users/${id}`, values)
        notification.success({
          message: 'Updated',
          description: 'User updated successfully',
        })
      } else {
        await axios.post('/admin/users', values)
        notification.success({
          message: 'Saved',
          description: 'User created successfully',
        })
      }

      setOpen(false)
      refetch()
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors)
      }
    }
  }

  /* ===================== UI ===================== */

  return (
    <>
      <Head title="User Management" />

      <div className="mt-10 flex justify-center">
        <div className="w-full mx-4 max-w-6xl rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                User Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage system users and permissions
              </p>
            </div>

            <Button
              type="primary"
              icon={<FileAddOutlined />}
              onClick={handleNew}
            >
              New User
            </Button>
          </div>

          <div className='my-4'>
            <label htmlFor="">Search</label>
            <Input.Search />
          </div>

          {/* Table */}
          <Table
            bordered
            size="middle"
            rowKey="id"
            loading={isFetching}
            pagination={false}
            dataSource={Array.isArray(data?.data) ? data?.data : []}
            rowClassName={() => 'hover:bg-gray-50'}
            locale={{
              emptyText: isFetching ? 'Loading users...' : 'No users found',
            }}
          >
            <Column title="ID" dataIndex="id" />
            <Column title="Username" dataIndex="username" />
            <Column title="Last Name" dataIndex="lname" />
            <Column title="First Name" dataIndex="fname" />
            <Column title="Middle Name" dataIndex="mname" />
            <Column title="Email" dataIndex="email" />
            <Column title="Role" dataIndex="role" />

            <Column
              title="Action"
              render={(_, record: User) => (
                <Space>
                  <Button
                    size="small"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record.id)}
                  />
                  <ChangePassword
                    data={record}
                    onSuccess={() => refetch()}
                  />
                </Space>
              )}
            />
          </Table>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <Pagination
              current={page}
              pageSize={perPage}
              total={data?.total}
              showSizeChanger
              onChange={(p, ps) => {
                setPage(p)
                setPerPage(ps)
              }}
            />

            <span className="text-sm text-gray-500">
              Total users: {data?.total || 0}
            </span>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        open={open}
        width={720}
        title="User Information"
        okText="Save"
        cancelText="Cancel"
        onCancel={() => setOpen(false)}
        okButtonProps={{ htmlType: 'submit' }}
        destroyOnHidden
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
            initialValues={{
              sex: 'MALE',
              role: 'USER',
            }}
          >
            {dom}
          </Form>
        )}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="username" label="Username">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="lname" label="Last Name">
            <Input />
          </Form.Item>

          <Form.Item name="fname" label="First Name">
            <Input />
          </Form.Item>

          <Form.Item name="mname" label="Middle Name">
            <Input />
          </Form.Item>

          <Form.Item name="role" label="Role">
            <Select
              options={[
                { value: 'encoder', label: 'ENCODER' },
                { value: 'publisher', label: 'PUBLISHER' },
                { value: 'admin', label: 'ADMINISTRATOR' },
              ]}
            />
          </Form.Item>
        </div>

        {id === 0 && (
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Account Password
            </p>

            <Form.Item name="password" label="Password">
              <Input.Password
                iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="password_confirmation"
              label="Confirm Password"
            >
              <Input.Password
                iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          </div>
        )}
      </Modal>
    </>
  )
}

AdminUserIndex.layout = (page: any) => (
  <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
)

export default AdminUserIndex
