
import {  Head, router } from '@inertiajs/react'

import {
  Button,
} from 'antd';

import { FileAddOutlined } from '@ant-design/icons';

import { useState } from 'react'
import axios from 'axios';

import { useQuery } from '@tanstack/react-query';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TableArticles from '@/Components/TableArticles';
import SearchFilter from '@/Components/SearchFilter';

const AdminArticleIndex = () => {


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

      const res = await axios.get(`/admin/get-articles?${params}`);
      return res.data;
    },
  });

  return (
    <>
      <Head title="Articles" />

      <div className="flex justify-center px-4">
        <div className="w-full max-w-[1300px] bg-white rounded-lg shadow-sm border border-slate-200 p-6">

          {/* ================= HEADER ================= */}
          <div className="mb-6 flex items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Science & Technology Articles
              </h1>
              <p className="text-sm text-slate-500">
                Manage, review, and publish science & technology articles
              </p>
            </div>

             <Button
              className='ml-auto'
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
    </>
  )
}

AdminArticleIndex.layout = (page: any) => <AuthenticatedLayout user={page.props.auth.user}>{page}</AuthenticatedLayout>
export default AdminArticleIndex;


