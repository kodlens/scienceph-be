import { Head, router } from '@inertiajs/react'
import { FileAddOutlined } from '@ant-design/icons'
import {
  Button,

} from 'antd'
import { ReactNode, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Error404 from '@/Components/Error404'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import SearchFilter from '@/Components/SearchFilter'
import TableArticles from '@/Components/TableArticles'

export default function PublisherMaterialIndex() {

  const [page, setPage] = useState(1)

  const perPage = 10

  const [filters, setFilters] = useState({
    status: '',
    title: '',
    encoder: '',
    modifier: ''
  })
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['articles',  perPage, page, filters.status ],
    queryFn: async () => {
      const params = [
        `perpage=${perPage}`,
        `title=${filters.title ? filters.title : ''}`,
        `status=${filters.status ? filters.status : ''}`,
        `encoder=${filters.encoder ? filters.encoder : ''}`,
        `modifier=${filters.modifier ? filters.modifier : ''}`,
        `page=${page}`,
      ].join('&')

      const res = await axios.get(`/publisher/get-articles?${params}`)
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  if (error) {
    return <Error404 error={error} />
  }

  return (
    <>
      <Head title="Articles" />

      <div className="flex justify-center px-4">
        <div className="w-full max-w-[1300px] bg-white rounded-lg shadow-sm border border-slate-200 p-6">

          {/* ================= HEADER ================= */}
          <div className="mb-6 flex items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Articles
              </h1>
              <p className="text-sm text-slate-500">
                Manage, review, and publish science & technology articles
              </p>
            </div>

            <Button
              className='ml-auto'
              icon={<FileAddOutlined />}
              type="primary"
              onClick={() => router.visit('/publisher/articles/create')}
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
            routePrefix='publisher'
            data={data}
            isFetching={isFetching}
            refetch={refetch}
            paginationPageChange={(v) => {
              console.log(v);
              setPage(v)
            }}
            page={page}
            showDelete={false}
            showEdit={true}
            showPublish={true}
            showDraft={true}
            showView={true}
            showTrash={true}
          />

          {/* ================= ACTION ================= */}
          <div className="flex justify-end mb-4">

          </div>


        </div>
      </div>
    </>
  )
}

PublisherMaterialIndex.layout = (page: ReactNode) => (
  <AuthenticatedLayout user={(page as any).props.auth.user}>
    {page}
  </AuthenticatedLayout>
)
