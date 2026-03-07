import { Head, router } from '@inertiajs/react'
import { FileAddOutlined, FilterOutlined, ProfileOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Select } from 'antd'
import { ReactNode, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Error404 from '@/Components/Error404'
import { statusDropdownMenu } from '@/helper/statusMenu'
import TableMaterials from '@/Components/TableMaterials'
import PublisherLayout from '@/Layouts/PublisherLayout'

type Filters = {
  status: string
  title: string
  encoder: string
  modifier: string
}

export default function PublisherMaterialIndex() {
  const [page, setPage] = useState(1)
  const perPage = 10

  const [filters, setFilters] = useState<Filters>({
    status: '',
    title: '',
    encoder: '',
    modifier: '',
  })

  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    status: '',
    title: '',
    encoder: '',
    modifier: '',
  })

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['publisher-materials', { perPage, page, appliedFilters }],
    queryFn: async () => {
      const params = [
        `perpage=${perPage}`,
        `title=${appliedFilters.title}`,
        `status=${appliedFilters.status}`,
        `encoder=${appliedFilters.encoder}`,
        `modifier=${appliedFilters.modifier}`,
        `page=${page}`,
      ].join('&')

      const res = await axios.get(`/publisher/get-materials?${params}`)
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
      modifier: '',
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
      <Head title="Materials" />

      <div className="flex justify-center">
        <div className="w-full max-w-[1300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className='relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-teal-50 px-6 py-6'>
            <div className='pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-100/60 blur-2xl' />
            <div className='pointer-events-none absolute -left-8 -bottom-14 h-36 w-36 rounded-full bg-teal-100/70 blur-2xl' />

            <div className='relative flex flex-wrap items-start gap-4'>
              <div className='inline-flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-200 bg-white text-cyan-600 shadow-sm'>
                <ProfileOutlined className='text-xl' />
              </div>

              <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-700'>
                  Publisher Panel
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight text-slate-900">
                  Materials
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Review, update, and publish submitted science and technology materials.
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
              <div>Apply filters and click Search to refresh the materials list.</div>
              <Button
                className='ml-auto'
                icon={<FileAddOutlined />}
                type="primary"
                onClick={() => router.visit('/publisher/materials/create')}
              >
                New Material
              </Button>
            </div>

            <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Select
                  value={filters.status}
                  onChange={(v) => setFilters((prev) => ({ ...prev, status: v }))}
                  options={statusDropdownMenu('publisher')}
                />

                <Input
                  placeholder="Search by material title"
                  value={filters.title}
                  prefix={<SearchOutlined className='text-slate-400' />}
                  onChange={(e) => setFilters((prev) => ({ ...prev, title: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyFilters()
                  }}
                  allowClear
                />

                <Input
                  placeholder="Search by encoder name"
                  value={filters.encoder}
                  onChange={(e) => setFilters((prev) => ({ ...prev, encoder: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyFilters()
                  }}
                  allowClear
                />

                <Input
                  placeholder="Search by modifier name"
                  value={filters.modifier}
                  onChange={(e) => setFilters((prev) => ({ ...prev, modifier: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') applyFilters()
                  }}
                  allowClear
                />
              </div>

              <div className='mt-3 flex justify-end gap-2'>
                <Button onClick={clearFilters}>Clear</Button>
                <Button type="primary" onClick={applyFilters}>Search</Button>
              </div>
            </div>

            <TableMaterials
              routePrefix='publisher'
              data={data}
              isFetching={isFetching}
              refetch={refetch}
              paginationPageChange={(v) => {
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
          </div>
        </div>
      </div>
    </>
  )
}

PublisherMaterialIndex.layout = (page: ReactNode) => (
  <PublisherLayout user={(page as any).props.auth.user}>
    {page}
  </PublisherLayout>
)
