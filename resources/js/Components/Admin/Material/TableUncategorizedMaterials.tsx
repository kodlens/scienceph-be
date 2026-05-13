import { dateFormat, formatNumber, truncate } from '@/helper/helperFunctions'
import { router } from '@inertiajs/react'
import { Table, Dropdown, Button, Pagination, App, MenuProps } from 'antd'
import Column from 'antd/es/table/Column'
import axios from 'axios'
//import { adminMenuItems } from '@/helper/adminMenuItems'
import { menuItems } from '@/helper/menuItems'
import { Material } from '@/types/material'
import MaterialView from '../../MaterialView'
import { User } from '@/types'

type Props = {
  routePrefix: string
  data: { data: Material[], total: number }
  user: User,
  isFetching: boolean
  page: number
  paginationPageChange: (page: number) => void
  refetch: () => void
  // New Props
  showEdit?: boolean
  showSubmit?:boolean,
  showDelete?: boolean
  showTrash?: boolean
  showPublish?: boolean
  showDraft?: boolean
  showView?: boolean
  extraActions?: (material: Material) => MenuProps['items']

}
const TableUncategorizedMaterials = (
  { routePrefix, data, isFetching, refetch, page, paginationPageChange, user,
    showEdit, showSubmit, showTrash, showView, showPublish, showDraft, showDelete
}: Props) => {

  const {notification, modal} = App.useApp();

  const statusStyles: Record<string, string> = {
    submit: 'bg-blue-100 text-blue-700',
    publish: 'bg-green-100 text-green-700',
    draft: 'bg-slate-100 text-slate-700',
    return: 'bg-red-100 text-red-700',
  }

  const classificationStyles: Record<string, string> = {
    scienceph: 'bg-sky-100 text-sky-700 border border-sky-200',
    dostv: 'bg-amber-100 text-amber-700 border border-amber-200',
  }

  const handleView = (material: Material) => {
    modal.info({
      width: 1024,
      title: 'Material Preview',
      content: <MaterialView material={material} className={''} />,
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
        rowKey={(row: Material) => row.id}
        pagination={false}
        expandable={{
          expandedRowRender: (material: Material) => (
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <div className="grid md:grid-cols-5 gap-4 text-sm">

                <div>
                  <div className="text-slate-500">Category</div>
                  <div className="font-medium">{material.category?.name}</div>
                </div>
                <div>
                  <div className="text-slate-500">Author</div>
                  <div className="font-medium">{material.author}</div>
                </div>
                <div>
                  <div className="text-slate-500">Encoded</div>
                  <div>{dateFormat(material.encoded_at?.toString() ?? '')}</div>
                </div>
                <div>
                  <div className="text-slate-500">Modified</div>
                  <div>{dateFormat(material.modified_at?.toString() ?? '')}</div>
                </div>
                <div>
                  <div className="text-slate-500">Submitted</div>
                  <div>{dateFormat(material.submitted_at?.toString() ?? '')}</div>
                </div>
                <div>
                  <div className="text-slate-500">Publisher Publish</div>
                  <div>{dateFormat(material.publisher_publish_date?.toString() ?? '')}</div>
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
          render={(title, material: Material) => (
            <div className="space-y-2">
              <div className="font-medium text-slate-900">
                {title}
              </div>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  classificationStyles[material.classification ?? ''] ?? 'border border-slate-200 bg-slate-100 text-slate-700'
                }`}
              >
                {material.classification ?? 'unknown'}
              </span>
            </div>
          )}
        />

        {/* SUMMARY */}
        <Column
          title="Material Details"
          render={(_, material: Material) => (
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                {material.description_text
                  ? truncate(material.description_text, 14)
                  : '—'}
              </p>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Press Release:</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${material.is_press_release
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-600'
                    }`}
                >
                  {material.is_press_release ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Encoded By:</span>
                { material.encoded_by ? (
                  <span
                  className={`px-2 py-0.5 rounded-full font-medium `}
                >
                  {material.encoded_by.fname} {material.encoded_by.lname}
                </span>
                ):null}

              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Modified By:</span>
                { material.modified_by ? (
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium `}
                  >
                    {material.modified_by ? material.modified_by.fname : ''} {material.modified_by ? material.modified_by.lname : ''}
                  </span>
                ): null}
              </div>

            </div>
          )}
        />

        {/* PUBLICATION DATE */}
        <Column
          title="Publication Date"
          render={(_, material: Material) => (
            <span className="text-sm text-slate-700">
              {material.publish_date
                ? dateFormat(material.publish_date.toString())
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
          render={(_, material: Material) => (
            <Dropdown
              trigger={['click']}
              menu={{
                items: menuItems({
                  user,
                  material,
                  prefix: routePrefix,
                  handleEditClick: showEdit ? () =>
                    router.visit(`/${routePrefix}/uncategorized-materials/${material.id}/edit`)
                  : undefined,
                  handleSubmitClick: showSubmit ? async () => {
                    modal.confirm({
                      title: 'Submit',
                      content: 'This material will be set to submit.',
                      onOk: async () => {
                        await axios.post(`/${routePrefix}/uncategorized-materials-submit/${material.id}`)
                        refetch()
                      },
                    })
                  } : undefined,
                  handleTrashClick: showTrash ? async () => {
                    modal.confirm({
                      title: 'Move to Trash?',
                      content: 'This article will be moved to trash.',
                      onOk: async () => {
                        await axios.post(`/${routePrefix}/material-trash/${material.id}`)
                        refetch()
                      },
                    })
                  } : undefined,
                  handleView: showView ? () => handleView(material) : undefined,
                  handlePublish: showPublish ? async () => {
                    await axios.post(`/${routePrefix}/material-publish/${material.id}`).then(() => {
                       notification.success({
                        message: 'Material has been published.',
                      })
                      refetch()
                    })
                  } : undefined,
                  handleDraft: showDraft ? async () => {
                    await axios.post(`/${routePrefix}/material-draft/${material.id}`).then(() => {
                       notification.success({
                        message: 'Material has been returned to draft.',
                      })
                      refetch()
                    })
                  } : undefined,
                  handleDelete: showDelete ? () => {
                    modal.confirm({
                      title: 'Delete Material?',
                      content: 'This material will be permanently deleted.',
                      onOk: async () => {
                        await axios.delete(`/${routePrefix}/materials/${material.id}`)
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

    </>
  )
}

export default TableUncategorizedMaterials
