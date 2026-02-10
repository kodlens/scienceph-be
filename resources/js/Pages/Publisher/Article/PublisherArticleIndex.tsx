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
import TablePublisherArticle from './partials/TablePublisherArticle'
import SearchFilter from '@/Components/SearchFilter'

export default function EncoderPostIndex() {

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
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">
              Articles
            </h1>
            <p className="text-sm text-slate-500">
              Manage, review, and publish science & technology articles
            </p>
          </div>

          {/* ================= FILTERS ================= */}
          <SearchFilter
            filters={filters}
            setFilters={setFilters}
            refetch={refetch}

          />


          <TablePublisherArticle
            data={data}
            isFetching={isFetching}
            refetch={refetch}
            paginationPageChange={(v) => {
              console.log(v);
              setPage(v)
            }}
            page={page}
          />

          {/* ================= ACTION ================= */}
          <div className="flex justify-end mb-4">
            <Button
              icon={<FileAddOutlined />}
              type="primary"
              onClick={() => router.visit('/encoder/articles/create')}
            >
              New Article
            </Button>
          </div>


        </div>
      </div>
    </>
  )
}

EncoderPostIndex.layout = (page: ReactNode) => (
  <AuthenticatedLayout user={(page as any).props.auth.user}>
    {page}
  </AuthenticatedLayout>
)
