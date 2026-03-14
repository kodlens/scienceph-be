import { Head, router } from '@inertiajs/react'
import { FileAddOutlined, FilterOutlined, ProfileOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Button,
  Input,
  Select,

} from 'antd'
import {  ReactElement, ReactNode, useEffect, useState } from 'react'
import axios from 'axios'
import EncoderLayout from '@/Layouts/EncoderLayout'
import { useQuery } from '@tanstack/react-query'
import Error404 from '@/Components/Error404'
import TableArticles from '@/Components/TableMaterials'
import { PageProps } from '@/types'
import { statusDropdownMenu } from '@/helper/statusMenu'

export default function EncoderMaterialIndex( { auth } : PageProps ) {


  const [page, setPage] = useState(1)
  const perPage = 10

  const [filters, setFilters] = useState({
    status: '',
    title: '',
  })
  const [appliedFilters, setAppliedFilters] = useState({
    status: '',
    title: '',
  })



  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['encoder-materials', { perPage, page, appliedFilters }],
    queryFn: async () => {
      const params = [
        `perpage=${perPage}`,
        `title=${appliedFilters.title ? appliedFilters.title : ''}`,
        `status=${appliedFilters.status ? appliedFilters.status : ''}`,
        `page=${page}`,
      ].join('&')

      const res = await axios.get(`/encoder/get-materials?${params}`)
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  const applyFilters = () => {
    setPage(1)
    setAppliedFilters({
      title: filters.title.trim(),
      status: filters.status,
    })
  }

  const clearFilters = () => {
    setPage(1)
    setFilters({
      title: '',
      status: '',
    })
    setAppliedFilters({
      title: '',
      status: '',
    })
  }

  useEffect(()=>{
    setAppliedFilters({
      title: filters.title,
      status: filters.status,
    })

  }, [filters.status])

  useEffect(()=>{
    refetch()
  }, [appliedFilters.status])



  if (error) {
    return <Error404 error={error} />
  }

  return (
    <>
      <Head title="All Materials" />


      <div className="flex justify-center">
        <div className="w-full max-w-[1300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* ================= HEADER ================= */}
          <div className='relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-6 py-6'>
            <div className='pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-100/60 blur-2xl' />
            <div className='pointer-events-none absolute -left-8 -bottom-14 h-36 w-36 rounded-full bg-sky-100/70 blur-2xl' />

            <div className='relative flex flex-wrap items-start gap-4'>
              <div className='inline-flex h-12 w-12 items-center justify-center rounded-xl border border-sky-200 bg-white text-sky-600 shadow-sm'>
                <ProfileOutlined className='text-xl' />
              </div>

              <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700'>
                  Encoder Panel
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight text-slate-900">
                  All Materials
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Manage and update your encoded science and technology materials.
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
              <div>Use filters then click Search to refresh the materials list.</div>

              <Button
                className='ml-auto'
                icon={<FileAddOutlined />}
                type="primary"
                onClick={() => router.visit('/encoder/materials/create')}
              >
                New Material
              </Button>

            </div>

          {/* ================= FILTERS ================= */}
          <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:flex-row">

            <Select
              className="w-[180px]"
              value={filters.status}
              onChange={(v) =>
                setFilters((prev) => ({ ...prev, status: v }))
              }
              options={statusDropdownMenu('encoder')}
            />

            <Input
              placeholder="Search by material title"
              className="w-full"
              value={filters.title}
              prefix={<SearchOutlined className='text-slate-400' />}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, title: e.target.value }))
              }
              onKeyDown={(e)=>{
                if(e.key === 'Enter')
                  applyFilters()
              }}
              allowClear
            />

            <Button className="ml-auto" type="primary" onClick={applyFilters}>
              Search
            </Button>
            <Button onClick={clearFilters}>
              Clear
            </Button>
          </div>


          <div className='overflow-auto'>

            <TableArticles
              routePrefix='encoder'
              data={data}
              isFetching={isFetching}
              refetch={refetch}
              paginationPageChange={(v) => {
                setPage(v)
              }}
              page={page}
              user={auth.user}
              showDelete={false}
              showSubmit={true}
              showEdit={true}
              showPublish={false}
              showDraft={true}
              showView={true}
              showTrash={true}
            />

          </div>
          </div>


        </div>
      </div>
    </>
  )
}

EncoderMaterialIndex.layout = (page: ReactNode) => (
  <EncoderLayout user={(page as ReactElement).props.auth.user}>
    {page}
  </EncoderLayout>
)
