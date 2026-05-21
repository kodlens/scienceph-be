import { Head } from '@inertiajs/react'
import { DownloadOutlined, ProfileOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Pagination,
  Table,

} from 'antd'
import { ReactElement, ReactNode, useState } from 'react'
import axios from 'axios'
import EncoderLayout from '@/Layouts/EncoderLayout'
import { useQuery } from '@tanstack/react-query'
import Error404 from '@/Components/Error404'
import Column from 'antd/es/table/Column'
import { dateFormat, formatNumber } from '@/helper/helperFunctions'
import dayjs from 'dayjs'



type LogsProp = {
  id: number;
  action: string;
  description: string;
  created_at: Date;
}


export default function ActivityLogsIndex() {


  const [page, setPage] = useState(1)
  const perPage = 10
  const defaultFrom = dayjs().startOf('month').format('YYYY-MM-DD')
  const defaultTo = dayjs().endOf('month').format('YYYY-MM-DD')

  const [filters, setFilters] = useState({
    from: defaultFrom,
    to: defaultTo,
  })
  const [appliedFilters, setAppliedFilters] = useState({
    from: defaultFrom,
    to: defaultTo,
  })



  const { data, isFetching, error } = useQuery({
    queryKey: ['activity-logs', { perPage, page, appliedFilters }],
    queryFn: async () => {
      const params = [
        `perpage=${perPage}`,
        `from=${appliedFilters.from ? appliedFilters.from : ''}`,
        `to=${appliedFilters.to ? appliedFilters.to : ''}`,
        `page=${page}`,
      ].join('&')

      const res = await axios.get(`/encoder/get-activity-logs?${params}`)
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  const applyFilters = () => {
    setPage(1)
    setAppliedFilters({
      from: filters.from,
      to: filters.to,
    })
  }

  const clearFilters = () => {
    setPage(1)
    setFilters({
      from: defaultFrom,
      to: defaultTo,
    })
    setAppliedFilters({
      from: defaultFrom,
      to: defaultTo,
    })
  }

  if (error) {
    return <Error404 error={error} />
  }

  function paginationPageChange(value: number) {
    setPage(value)
  }

  function exportToExcel() {
    const params = new URLSearchParams({
      from: appliedFilters.from || '',
      to: appliedFilters.to || '',
    })
    window.location.href = `/encoder/export-activity-logs?${params.toString()}`
  }

  return (
    <>
      <Head title="Activity Logs" />


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
                  Activity Logs
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Track Activity Logs
                </p>
              </div>

              <div className='ml-auto rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-right shadow-sm'>
                <p className='text-[11px] uppercase tracking-wide text-slate-500'>Total Records</p>
                <p className='text-2xl font-semibold leading-none text-slate-900'>{data?.total ?? 0}</p>
              </div>

            </div>
          </div>
          <div className='p-6'>
            <div className='mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:flex-row'>
              <DatePicker
                placeholder="From date"
                className="w-full md:w-[220px]"
                value={filters.from ? dayjs(filters.from) : null}
                onChange={(_, dateString) =>
                  setFilters((prev) => ({ ...prev, from: Array.isArray(dateString) ? '' : dateString }))
                }
                allowClear
              />

              <DatePicker
                placeholder="To date"
                className="w-full md:w-[220px]"
                value={filters.to ? dayjs(filters.to) : null}
                onChange={(_, dateString) =>
                  setFilters((prev) => ({ ...prev, to: Array.isArray(dateString) ? '' : dateString }))
                }
                allowClear
              />

              <Button className="ml-auto" type="primary" onClick={applyFilters}>
                Search
              </Button>
              <Button onClick={clearFilters}>
                Clear
              </Button>
              <Button icon={<DownloadOutlined />} onClick={exportToExcel}>
                Export to Excel
              </Button>
            </div>

            <div className='overflow-auto'>

              <Table
                size="middle"
                bordered
                loading={isFetching}
                dataSource={data?.data}
                rowKey={(row: LogsProp) => row.id}
                pagination={false}
              >

                {/* ID */}
                <Column title="ID" dataIndex="id" width={70} />
                <Column title="Action" dataIndex="action" key="action" />
                <Column title="Description" dataIndex="description" key="description" />


                {/* PUBLICATION DATE */}
                <Column
                  title="Logs Date"
                  render={(_, actLog: LogsProp) => (
                    <span className="text-sm text-slate-700">
                      {actLog.created_at
                        ? dateFormat(actLog.created_at.toString())
                        : '—'}
                    </span>
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
                    paginationPageChange(value)
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
      </div>
    </>
  )
}

ActivityLogsIndex.layout = (page: ReactNode) => (
  <EncoderLayout user={(page as ReactElement).props.auth.user}>
    {page}
  </EncoderLayout>
)
