import { Head } from '@inertiajs/react'

import {
  SearchOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

import {
  Table,   Pagination, Input,
} from 'antd';


import { useEffect, useState } from 'react'
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import { Category } from '@/types/category';

const { Column } = Table;
const { Search } = Input;

const AdminActivityLogsIndex = () => {

  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const sortBy = 'id.desc'

  interface CategoryResponse {
    data: any[];
    total: number;
  }

  const loadAsync = async () => {

    setLoading(true)
    const params = [
      `search=${search}`,
      `perpage=${perPage}`,
      `sort_by=${sortBy}`,
      `page=${page}`
    ].join('&');

    try {
      const res = await axios.get<CategoryResponse>(`/admin/get-activity-logs?${params}`);
      setData(res.data.data)
      setTotal(res.data.total)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAsync()
  }, [page])


  const onPageChange = (index: number, perPage: number) => {
    setPage(index)
    setPerPage(perPage)
  }

  return (
    <>
      <Head title="Category Management"></Head>

      <div className='flex justify-center'>

        {/* card */}
        <div className='w-full max-w-[1150px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
          {/* card header */}
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
                <h1 className='mt-1 text-2xl font-semibold leading-tight text-slate-900'>
                  Activity Logs
                </h1>
                <p className='mt-1 text-sm text-slate-600'>
                  Create and maintain article categories and visibility status.
                </p>

                <div className='mt-3 flex flex-wrap gap-2'>
                  <span className='rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-700'>
                    Content Taxonomy
                  </span>
                  <span className='rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700'>
                    {total} Categories
                  </span>
                </div>
              </div>

              <div className='ml-auto rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm'>
                <p className='text-[11px] uppercase tracking-wide text-slate-500'>Total Records</p>
                <p className='text-2xl font-semibold leading-none text-slate-900'>{total}</p>
              </div>
            </div>
          </div>
          {/* card body */}
          <div className='p-6'>
            <div className='mb-4 flex flex-wrap items-center gap-3'>
              <Search placeholder="Search..."
                autoComplete='off'
                enterButton={<><SearchOutlined /> Search</>}
                size="large"
                id="search"
                onChange={(e) => setSearch(e.target.value)}
                loading={loading}
                onSearch={loadAsync}
                className='w-full md:max-w-[420px]'
              />
            </div>
            <Table dataSource={data}
              loading={loading}
              rowKey={(data: Category) => data.id as number}
              pagination={false}
              scroll={{ x: 980 }}
              className='[&_.ant-table-thead>tr>th]:bg-slate-50 [&_.ant-table-thead>tr>th]:text-slate-700'>

              <Column title="Id" dataIndex="id" width={80} />
              <Column title="Title" dataIndex={['material', 'title']} key="title" />
              <Column title="Description" dataIndex="description" key="description" />
              <Column title="Action" dataIndex="action" key="action" />

            </Table>

            <div className='mt-5 flex justify-end'>
              <Pagination
                onChange={onPageChange}
                current={page}
                defaultCurrent={1}
                showSizeChanger
                total={total}
                showTotal={(value, range) => `${range[0]}-${range[1]} of ${value} items`}
              />
            </div>

          </div>
        </div>
        {/* card */}

      </div>

    </>
  )
}

AdminActivityLogsIndex.layout = (page: any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default AdminActivityLogsIndex;
