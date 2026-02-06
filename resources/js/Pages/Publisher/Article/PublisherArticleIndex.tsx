import { Head, router } from '@inertiajs/react'
import { FileAddOutlined } from '@ant-design/icons'
import {
  Button,
  Input,
  Select,

} from 'antd'
import { KeyboardEvent, ReactNode, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Error404 from '@/Components/Error404'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import TablePublisherArticle from './partials/TablePublisherArticle'
import { statusDropdownMenu } from '@/helper/statusMenu'

export default function EncoderPostIndex() {

  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const perPage = 10

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['articles', { perPage, page, status }],
    queryFn: async () => {
      const params = [
        `perpage=${perPage}`,
        `search=${search}`,
        `page=${page}`,
        `status=${status}`,
      ].join('&')

      const res = await axios.get(`/publisher/get-articles?${params}`)
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  if (error) {
    return <Error404 error={error} />
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') refetch()
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
          <div className="flex flex-wrap items-center gap-3 mb-5 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Select
              className="w-[180px]"
              defaultValue=""
              onChange={setStatus}
              options={statusDropdownMenu('publisher')}
            />

            <Input
              placeholder="Search by article title"
              className="max-w-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <Button type="primary" onClick={() => refetch()}>
              Search
            </Button>
          </div>

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
