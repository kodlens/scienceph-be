
import {  Head} from '@inertiajs/react'

import {
  App,
  Button,
  Dropdown,
  Input,
  Pagination,
  Table,
} from 'antd';

import {  AppstoreOutlined, SearchOutlined} from '@ant-design/icons';

import { ReactElement, useState } from 'react'
import axios from 'axios';

import { useQuery } from '@tanstack/react-query';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Column from 'antd/es/table/Column';
import { formatNumber } from '@/helper/helperFunctions';

type MigrationProp = {
  id: number;
  name: string;
  last_migrated_id: number;
  last_migrated_at: string;
  status: number;
}
const AdminMigrationMaterialIndex = ( ) => {


  //const [perPage, setPerPage] = useState(10);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const {notification } = App.useApp();

  const statusStyles: Record<string, string> = {
    queue: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    // failed: 'bg-red-100 text-red-700',
    // processing: 'bg-yellow-100 text-yellow-700',
  }


  const [filters, setFilters] = useState({
      status: '',
      name: ''
    })

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['migrations', page, perPage, filters.status],
    queryFn: async () => {
      const params = [
        `perpage=${perPage}`,
        `name=${filters.name ? filters.name : ''}`,
        `page=${page}`,
      ].join('&')

      const res = await axios.get(`/admin/get-migration-materials?${params}`);
      return res.data;
    },
  });

  const handleDelete = (migration: MigrationProp) => {
    axios.delete('/admin/migration-materials/' + migration.id)
      .then((res) => {

        console.log(res.data);

        if(res.data.success){
          notification.success({
            message: 'Deleted',
            description: 'Migration removed successfully',
          })
          refetch()
        }
    })
  }

  return (
    <>
      <Head title="Materials" />

      <div className="flex justify-center mx-2">
        <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* ================= HEADER ================= */}
          <div className='relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-6 py-6'>
            <div className='pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-100/60 blur-2xl' />
            <div className='pointer-events-none absolute -left-8 -bottom-14 h-36 w-36 rounded-full bg-sky-100/70 blur-2xl' />

            <div className='relative flex flex-wrap items-start gap-4'>
              <div className='inline-flex h-12 w-12 items-center justify-center rounded-xl border border-sky-200 bg-white text-sky-600 shadow-sm'>
                <AppstoreOutlined className='text-xl' />
              </div>

              <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700'>
                  Admin Panel
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight text-slate-900">
                  Migrations/Jobs Queue
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Review and manage migrations and job queues.
                </p>
              </div>

              <div className='ml-auto flex items-center gap-3'>
                <div className='rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-right shadow-sm'>
                  <p className='text-[11px] uppercase tracking-wide text-slate-500'>Total Records</p>
                  <p className='text-2xl font-semibold leading-none text-slate-900'>{data?.total ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='p-6'>
            {/* <div className='mb-4 flex items-center gap-2 text-sm text-slate-500'>
              <ProfileOutlined />
              <div>Use filters below, then click search to refresh the DOSTv content list.</div>

                <Button
                  className='h-11 ml-auto'
                  icon={<FileAddOutlined />}
                  type="primary"
                  onClick={() => router.visit('/admin/materials/create')}
                >
                  New Material
                </Button>

            </div> */}

            {/* ================= FILTERS ================= */}


            <div className='flex gap-4 flex-col md:flex-row my-4'>
              <Input
                placeholder="Search by article title"
                className="w-full"
                value={filters.name}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, title: e.target.value }))
                }
                allowClear
                onKeyDown={(e)=> {
                  if(e.key === 'Enter')
                    refetch()
                }}
              />

              <Button
                onClick={() => refetch()}
                type='primary'
                icon={<SearchOutlined />}>
                Search
              </Button>
            </div>


            <Table
              size="middle"
              bordered
              loading={isFetching}
              dataSource={data?.data}
              rowKey={(row: MigrationProp) => row.id}
              pagination={false}
            >

              {/* ID */}
              <Column title="ID" dataIndex="id" width={70} />

              <Column
                title="Name"
                dataIndex="name"
                render={(name) => (
                  <div className="font-medium text-slate-900">
                    {name}
                  </div>
                )}
              />

              <Column
                title="Last Migrated Id"
                dataIndex="last_migrated_id"
                render={(last_migrated_id) => (
                  <div className="font-medium text-slate-900">
                    {last_migrated_id}
                  </div>
                )}
              />


              {/* STATUS */}
              <Column
                title="Status"
                dataIndex="status"
                render={(status: string) => (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] ?? 'bg-slate-100'
                      }`}
                  >
                    {status.toUpperCase()}
                  </span>
                )}
              />

              {/* ACTION */}
              <Column
                title="Action"
                render={(_, row: MigrationProp) => (
                  <Dropdown
                    trigger={['click']}
                    menu={{
                      items: [
                        {
                          key: 'delete',
                          label: 'Delete',
                          onClick: () => handleDelete(row),
                        },
                      ],
                    }}
                  >
                    <Button size="small" type="text">
                      •••
                    </Button>
                  </Dropdown>
                )}
              />

            </Table>

            {/* ================= PAGINATION ================= */}
            <div className="mt-6 mb-4 flex justify-between">
              <Pagination
                size="small"
                current={page}
                total={data?.total}
                onChange={(value) => {
                 // paginationPageChange(value)
                  setPerPage(value)

                }}
                pageSizeOptions={['10', '20', '50']}
                onShowSizeChange={(current, size) => {
                  //pageSizeChange?.(current, size);
                }}
              />

              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <span>Total:</span>
                <span className="font-bold text-gray-900">{formatNumber(data?.total)}</span>
              </div>
            </div>


          </div>

        </div>
      </div>
    </>
  )
}

AdminMigrationMaterialIndex.layout = (page: ReactElement) => <AuthenticatedLayout user={page.props.auth.user}>{page}</AuthenticatedLayout>
export default AdminMigrationMaterialIndex;
