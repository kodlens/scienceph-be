
import {  Head, router } from '@inertiajs/react'

import {
  Button,
} from 'antd';

import { FileAddOutlined, AppstoreOutlined, ProfileOutlined } from '@ant-design/icons';

import { useState } from 'react'
import axios from 'axios';

import { useQuery } from '@tanstack/react-query';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TableArticles from '@/Components/TableMaterials';
import SearchFilter from '@/Components/SearchFilter';

const AdminMaterialIndex = () => {


  //const [perPage, setPerPage] = useState(10);
  const perPage = 10
  const [page, setPage] = useState(1);


  const [filters, setFilters] = useState({
      status: '',
      title: '',
      encoder: '',
      modifier: ''
    })

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['articles', page, perPage, filters.status],
    queryFn: async () => {
      const params = [
        `perpage=${perPage}`,
        `title=${filters.title ? filters.title : ''}`,
        `status=${filters.status ? filters.status : ''}`,
        `encoder=${filters.encoder ? filters.encoder : ''}`,
        `modifier=${filters.modifier ? filters.modifier : ''}`,
        `page=${page}`,
      ].join('&')

      const res = await axios.get(`/admin/get-materials?${params}`);
      return res.data;
    },
  });

  return (
    <>
      <Head title="Articles" />

      <div className="flex justify-center px-4 py-8">
        <div className="w-full max-w-[1300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
                  Science & Technology Articles
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Review submissions, manage publication status, and keep materials up to date.
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
            <div className='mb-4 flex items-center gap-2 text-sm text-slate-500'>
              <ProfileOutlined />
              <div>Use filters below, then click search to refresh the article list.</div>

                <Button
                  className='h-11 ml-auto'
                  icon={<FileAddOutlined />}
                  type="primary"
                  onClick={() => router.visit('/admin/articles/create')}
                >
                  New Article
                </Button>

            </div>

            {/* ================= FILTERS ================= */}
            <SearchFilter
              filters={filters}
              setFilters={setFilters}
              refetch={refetch}
            />

            <TableArticles
              routePrefix='admin'
              data={data}
              isFetching={isFetching}
              refetch={refetch}
              page={page}
              paginationPageChange={(p)=>{
                setPage(p)
              }}
              showDelete={true}
              showEdit={true}
              showTrash={true}
              showPublish={true}
              showDraft={true}
              showView={true}
            />
          </div>


        </div>
      </div>
    </>
  )
}

AdminMaterialIndex.layout = (page: any) => <AuthenticatedLayout user={page.props.auth.user}>{page}</AuthenticatedLayout>
export default AdminMaterialIndex;
