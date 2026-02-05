import { Head, router } from '@inertiajs/react'
import { FileAddOutlined } from '@ant-design/icons'
import {
  Space,
  Table,
  Pagination,
  Button,
  Input,
  Select,
  Dropdown,
  App,
} from 'antd'
import { KeyboardEvent, ReactNode, useState } from 'react'
import axios from 'axios'

import EncoderLayout from '@/Layouts/EncoderLayout'
import { dateFormat, truncate } from '@/helper/helperFunctions'
import { useQuery } from '@tanstack/react-query'
import { Article } from '@/types/article'
import Error404 from '@/Components/Error404'
import { encoderMenuItems } from '@/helper/encoderMenuItems'
import ArticleView from '@/Components/ArticleView'

const { Column } = Table

export default function EncoderPostIndex() {
  const { modal } = App.useApp()

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

      const res = await axios.get(`/encoder/get-articles?${params}`)
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

  const handleView = (article: Article) => {
    modal.info({
      width: 1024,
      title: 'Article Preview',
      content: <ArticleView article={article} className={''} />,
    })
  }

  const statusStyles: Record<string, string> = {
    submit: 'bg-blue-100 text-blue-700',
    publish: 'bg-green-100 text-green-700',
    draft: 'bg-slate-100 text-slate-700',
    return: 'bg-red-100 text-red-700',
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
              options={[
                { label: 'All Status', value: '' },
                { label: 'Draft', value: 'draft' },
                // { label: 'Submitted', value: 'submit' },
                { label: 'Published', value: 'publish' },
              ]}
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

          {/* ================= TABLE ================= */}
          <Table
            size="middle"
            bordered
            loading={isFetching}
            dataSource={data?.data}
            rowKey={(row: Article) => row.id}
            pagination={false}
            expandable={{
              expandedRowRender: (article: Article) => (
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                  <div className="grid md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="text-slate-500">Category</div>
                      <div className="font-medium">{article.category?.name}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Section</div>
                      <div className="font-medium">{article.section?.name}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Author</div>
                      <div className="font-medium">{article.author}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Modified</div>
                      <div>{dateFormat(article.modified_at?.toString() ?? '')}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Encoded</div>
                      <div>{dateFormat(article.encoded_at?.toString() ?? '')}</div>
                    </div>
                  </div>
                </div>
              ),
            }}
          >

            {/* ID */}
            <Column title="ID" dataIndex="id" width={70} />

            {/* TITLE */}
            <Column
              title="Title"
              dataIndex="title"
              render={(title) => (
                <div className="font-medium text-slate-900">
                  {title}
                </div>
              )}
            />

            {/* SUMMARY */}
            <Column
              title="Article"
              render={(_, article: Article) => (
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">
                    {article.description_text
                      ? truncate(article.description_text, 14)
                      : '—'}
                  </p>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Press Release:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        article.is_press_release
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {article.is_press_release ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Encoded By:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium `}
                    >
                      {article.encoded_by.fname } {article.encoded_by.lname}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Modified By:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium `}
                    >
                      { article.modified_by ?? article.modified_by.lname }
                    </span>
                  </div>

                </div>
              )}
            />

            {/* PUBLICATION DATE */}
            <Column
              title="Publication Date"
              render={(_, article: Article) => (
                <span className="text-sm text-slate-700">
                  {article.publish_date
                    ? dateFormat(article.publish_date.toString())
                    : '—'}
                </span>
              )}
            />

            {/* STATUS */}
            <Column
              title="Status"
              dataIndex="status"
              render={(status: string) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusStyles[status] ?? 'bg-slate-100'
                  }`}
                >
                  {status.toUpperCase()}
                </span>
              )}
            />

            {/* ACTION */}
            <Column
              title="Action"
              render={(_, article: Article) => (
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: encoderMenuItems({
                      article,
                      handleEditClick: () =>
                        router.visit(`/encoder/articles/${article.id}/edit`),
                      handleTrashClick: async () => {
                        modal.confirm({
                          title: 'Move to Trash?',
                          content: 'This article will be moved to trash.',
                          onOk: async () => {
                            await axios.post(`/encoder/articles-trash/${article.id}`)
                            refetch()
                          },
                        })
                      },
                      handleView: () => handleView(article),
                    }),
                  }}
                >
                  <Button size="small" type="text">
                    •••
                  </Button>
                </Dropdown>
              )}
            />

          </Table>

          {/* ================= PAGINATION ================= */}
          <div className="mt-6 flex justify-end">
            <Pagination
              size="small"
              current={page}
              total={data?.total}
              onChange={setPage}
            />
          </div>
        </div>
      </div>
    </>
  )
}

EncoderPostIndex.layout = (page: ReactNode) => (
  <EncoderLayout user={(page as any).props.auth.user}>
    {page}
  </EncoderLayout>
)
