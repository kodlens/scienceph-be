import { dateFormat, truncate } from '@/helper/helperFunctions'
import { Article } from '@/types/article'
import { router } from '@inertiajs/react'
import { Table, Dropdown, Button, Pagination, App, MenuProps } from 'antd'
import modal from 'antd/es/modal'
import Column from 'antd/es/table/Column'
import axios from 'axios'
import ArticleView from '@/Components/ArticleView'
//import { adminMenuItems } from '@/helper/adminMenuItems'
import { menuItems } from '@/helper/menuItems'


type Props = {
  routePrefix: string
  data: { data: Article[], total: number }
  isFetching: boolean
  page: number
  paginationPageChange: (page: number) => void
  refetch: () => void
  // New Props
  showEdit?: boolean
  showDelete?: boolean
  showTrash?: boolean
  showPublish?: boolean
  showDraft?: boolean
  showView?: boolean
  extraActions?: (article: Article) => MenuProps['items']

}
const TableArticles = (
  { routePrefix, data, isFetching, refetch, page, paginationPageChange,
    showEdit, showTrash, showView, showPublish, showDraft, showDelete
}: Props) => {

  const {notification} = App.useApp();

  const statusStyles: Record<string, string> = {
    submit: 'bg-blue-100 text-blue-700',
    publish: 'bg-green-100 text-green-700',
    draft: 'bg-slate-100 text-slate-700',
    return: 'bg-red-100 text-red-700',
  }
  const handleView = (article: Article) => {
    modal.info({
      width: 1024,
      title: 'Article Preview',
      content: <ArticleView article={article} className={''} />,
    })
  }

  return (
    <>
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
                  className={`px-2 py-0.5 rounded-full font-medium ${article.is_press_release
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                    }`}
                >
                  {article.is_press_release ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Encoded By:</span>
                { article.encoded_by ? (
                  <span
                  className={`px-2 py-0.5 rounded-full font-medium `}
                >
                  {article.encoded_by.fname} {article.encoded_by.lname}
                </span>
                ):null}

              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Modified By:</span>
                { article.modified_by ? (
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium `}
                  >
                    {article.modified_by ? article.modified_by.fname : ''} {article.modified_by ? article.modified_by.lname : ''}
                  </span>
                ): null}
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
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] ?? 'bg-slate-100'
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
                items: menuItems({
                  article,
                  prefix: routePrefix,
                  handleEditClick: showEdit ? () =>
                    router.visit(`/${routePrefix}/articles/${article.id}/edit`)
                  : undefined,
                  handleTrashClick: showTrash ? async () => {
                    modal.confirm({
                      title: 'Move to Trash?',
                      content: 'This article will be moved to trash.',
                      onOk: async () => {
                        await axios.post(`/${routePrefix}/article-trash/${article.id}`)
                        refetch()
                      },
                    })
                  } : undefined,
                  handleView: showView ? () => handleView(article) : undefined,
                  handlePublish: showPublish ? async () => {
                    await axios.post(`/${routePrefix}/article-publish/${article.id}`).then(() => {
                       notification.success({
                        message: 'Article has been published.',
                      })
                      refetch()
                    })
                  } : undefined,
                  handleDraft: showDraft ? async () => {
                    await axios.post(`/${routePrefix}}/article-draft/${article.id}`).then(() => {
                       notification.success({
                        message: 'Article has been returned to draft.',
                      })
                      refetch()
                    })
                  } : undefined,
                  handleDelete: showDelete ? () => {
                    modal.confirm({
                      title: 'Delete Article?',
                      content: 'This article will be permanently deleted.',
                      onOk: async () => {
                        await axios.delete(`/${routePrefix}/articles/${article.id}`)
                        refetch()
                      },
                    })
                  } : undefined
                }) as MenuProps['items'],
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
      <div className="mt-6 mb-4 flex justify-end">
        <Pagination
          size="small"
          current={page}
          total={data?.total}
          onChange={(value) => {
            paginationPageChange(value)
          }}
        />
      </div>

    </>
  )
}

export default TableArticles
