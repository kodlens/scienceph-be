import { Head } from '@inertiajs/react'
import { ReactNode, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Button, Input, Select } from 'antd'
import { DeleteOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons'

import Error404 from '@/Components/Error404'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import TableMaterials from '@/Components/TableMaterials'
import { statusDropdownMenu } from '@/helper/statusMenu'

type Filters = {
  status: string
  title: string
  encoder: string
  modifier: string
}

export default function TrashIndex() {
  const [page, setPage] = useState(1)
  const perPage = 10

  const [filters, setFilters] = useState<Filters>({
    status: '',
    title: '',
    encoder: '',
    modifier: ''
  })

  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    status: '',
    title: '',
    encoder: '',
    modifier: ''
  })

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['admin-trash-materials', { perPage, page, appliedFilters }],
    queryFn: async () => {
      const params = [
        `perpage=${perPage}`,
        `title=${appliedFilters.title}`,
        `status=${appliedFilters.status}`,
        `encoder=${appliedFilters.encoder}`,
        `modifier=${appliedFilters.modifier}`,
        `page=${page}`,
      ].join('&')

      const res = await axios.get(`/admin/get-trash-materials?${params}`)
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  const applyFilters = () => {
    setPage(1)
    setAppliedFilters({
      status: filters.status,
      title: filters.title.trim(),
      encoder: filters.encoder.trim(),
      modifier: filters.modifier.trim(),
    })
  }

  const clearFilters = () => {
    const empty: Filters = {
      status: '',
      title: '',
      encoder: '',
      modifier: ''
    }
    setPage(1)
    setFilters(empty)
    setAppliedFilters(empty)
  }

  if (error) {
    return <Error404 error={error} />
  }

  return (
    <>
      <Head title="Trash Articles" />

      <div className="flex justify-center">
        <div className="w-full max-w-[1300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className='relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-rose-50 via-white to-orange-50 px-6 py-6'>
            <div className='pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-rose-100/60 blur-2xl' />
            <div className='pointer-events-none absolute -left-8 -bottom-14 h-36 w-36 rounded-full bg-orange-100/70 blur-2xl' />

            <div className='relative flex flex-wrap items-start gap-4'>
              <div className='inline-flex h-12 w-12 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600 shadow-sm'>
                <DeleteOutlined className='text-xl' />
              </div>

              <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-700'>
                  Admin Panel
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight text-slate-900">
                  Trash Articles
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Review removed records and restore content back to draft when needed.
                </p>
              </div>

              <div className='ml-auto rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-right shadow-sm'>
                <p className='text-[11px] uppercase tracking-wide text-slate-500'>Total Records</p>
                <p className='text-2xl font-semibold leading-none text-slate-900'>{data?.total ?? 0}</p>
              </div>
            </div>
          </div>

          <div className='p-6'>
            <div className='mb-4 flex items-center gap-2 text-sm text-slate-500'>
              <FilterOutlined />
              <div>Use filters and click Search to refresh the trash article list.</div>
            </div>

            <div className='mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4'>
              <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-4'>
                <Select
                  value={filters.status}
                  onChange={(v) => setFilters((prev) => ({ ...prev, status: v }))}
                  options={statusDropdownMenu('admin')}
                />

                <Input
                  value={filters.title}
                  placeholder='Search by article title'
                  prefix={<SearchOutlined className='text-slate-400' />}
                  onChange={(e) => setFilters((prev) => ({ ...prev, title: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyFilters()
                  }}
                  allowClear
                />

                <Input
                  value={filters.encoder}
                  placeholder='Search by encoder name'
                  onChange={(e) => setFilters((prev) => ({ ...prev, encoder: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyFilters()
                  }}
                  allowClear
                />

                <Input
                  value={filters.modifier}
                  placeholder='Search by modifier name'
                  onChange={(e) => setFilters((prev) => ({ ...prev, modifier: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyFilters()
                  }}
                  allowClear
                />
              </div>

              <div className='mt-3 flex justify-end gap-2'>
                <Button onClick={clearFilters}>Clear</Button>
                <Button type='primary' onClick={applyFilters}>Search</Button>
              </div>
            </div>

            <TableMaterials
              routePrefix='admin'
              data={data}
              isFetching={isFetching}
              refetch={refetch}
              paginationPageChange={(v) => {
                setPage(v)
              }}
              page={page}
              showDelete={false}
              showEdit={false}
              showPublish={false}
              showDraft={true}
              showView={true}
              showTrash={false}
            />
          </div>
        </div>
      </div>
    </>
  )
}

TrashIndex.layout = (page: ReactNode) => (
  <AuthenticatedLayout user={(page as any).props.auth.user}>
    {page}
  </AuthenticatedLayout>
)
