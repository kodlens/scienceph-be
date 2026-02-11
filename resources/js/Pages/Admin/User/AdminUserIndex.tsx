import { useState } from 'react'
import axios from 'axios'
import { Head } from '@inertiajs/react'
import {
  FileAddOutlined,
  EditOutlined,

} from '@ant-design/icons'
import {
  Table,
  Space,
  Pagination,
  Button,
  Input,
  App,
  Popconfirm,
  Form,
} from 'antd'

import AdminLayout from '@/Layouts/AdminLayout'
import ChangePassword from './partials/ChangePassword'
import { User } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import ModalCreateEditUser from './partials/ModalCreateEditUser'

const { Column } = Table



const AdminUserIndex = () => {

  const [form] = Form.useForm();

  const { notification } = App.useApp()

  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User>()
  const [perPage, setPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>('')

  /* ===================== DATA ===================== */

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['users', perPage, page, search],
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
    setUser(undefined)
    setOpen(true)
  }

  const handleEdit = async (record: User) => {
    setUser(record)
    setOpen(true)
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
            <Input.Search onSearch={(v)=>{
              setSearch(v)
            }}
            placeholder='Search Username, Last Name, First Name...'
            />
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
              title="OJT"
              dataIndex="is_ojt"
              key="is_ojt"
              align="center"
              render={(is_ojt) => (
                <span
                  className={`inline-flex items-center justify-center min-w-[60px] px-3 py-1 text-xs font-semibold rounded-full
                    ${is_ojt
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    }`}
                >
                  {is_ojt ? 'YES' : 'NO'}
                </span>
              )}
            />
            <Column
              title="Action"
              render={(_, record: User) => (
                <Space>
                  <Button
                    size="small"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                  />
                  <ChangePassword
                    data={record}
                    onSuccess={() => refetch()}
                  />

                  <Popconfirm
                    title="Delete User"
                    description="Are you sure to delete this user?"
                    onConfirm={()=>handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger icon={<Trash size={15}/>}></Button>
                  </Popconfirm>
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

      <ModalCreateEditUser user={user} modalOpen={open}
        form={form}
        onClose={()=>{
          setOpen(false)
          //console.log('set to false');
        }}
        refetch={()=>{
          refetch()
        }}
      />
    </>
  )
}

AdminUserIndex.layout = (page: any) => (
  <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
)

export default AdminUserIndex
