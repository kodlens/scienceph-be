import { Head } from '@inertiajs/react'

import {
  FileAddOutlined,
  DeleteOutlined, EditOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  TagsOutlined,
  AppstoreOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

import {
  Space, Table, Modal,
  Pagination, Button,
  Form, Input, Checkbox,
  App
} from 'antd';


import { useEffect, useState } from 'react'
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import { Subject } from '@/types/subject';

const { Column } = Table;
const { Search } = Input;

const AdminCategoryIndex = () => {

  const [form] = Form.useForm();

  const { notification, modal } = App.useApp();

  const [data, setData] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [open, setOpen] = useState(false); //for modal

  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState<any>({});

  const sortBy = 'id.desc'
  const [id, setId] = useState(0);

  interface AxiosResponse {
    data: any[];
    total: number;
  }

  const loadAsync = async () => {

    setLoading(true)
    const params = [
      `search=${search}`,
      `perpage=${perPage}`,
      `sort_by=${sortBy}`,
      `page=${page}`
    ].join('&');

    try {
      const res = await axios.get<AxiosResponse>(`/admin/get-categories?${params}`);
      setData(res.data.data)
      setTotal(res.data.total)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAsync()
  }, [page])


  const onPageChange = (index: number, perPage: number) => {
    setPage(index)
    setPerPage(perPage)
  }


  const getData = async (id: number) => {
    try {
      const res = await axios.get<Subject>(`/admin/categories/${id}`);
      form.setFields([
        { name: 'name', value: res.data.subject },
        { name: 'description', value: res.data.subject_heading },
        { name: 'active', value: res.data.active ? true : false },
      ]);
    } catch (err) {
      //console.log(err);
    }
  }


  const handClickNew = () => {
    //router.visit('/');
    setId(0)
    setOpen(true)
  }

  const handleEditClick = (id: number) => {
    setErrors({})
    setId(id);
    setOpen(true);
    getData(id);
  }

  const handleDeleteClick = async (id: number) => {
    const res = await axios.delete('/admin/categories/' + id);
    if (res.data.status === 'deleted') {
      notification.success({
        message: 'Deleted!',
        description: 'Category successfully deleted.',
        placement: 'topRight'
      })
      loadAsync()
    }
  }

  const onFinish = async (values: Subject) => {

    if (id > 0) {
      try {
        const res = await axios.put('/admin/categories/' + id, values)
        if (res.data.status === 'updated') {
          notification.success({
            message: 'Updated!',
            description: 'Category successfully updated.',
            placement: 'topRight'
          })
          setOpen(false)
          loadAsync()
        }
      } catch (err: any) {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors)
        }
      }
    } else {
      try {
        const res = await axios.post('/admin/categories', values)
        if (res.data.status === 'saved') {
          notification.info({
            message: 'Saved!',
            description: 'Category successfully save.',
            placement: 'topRight'
          })
          setOpen(false)
          loadAsync()
        }
      } catch (err: any) {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors)

        }
      }
    }

    //throw new Error('Function not implemented.');
  }

  return (
    <>
      <Head title="Subject Management"></Head>

      <div className='flex justify-center'>

        {/* card */}
        <div className='w-full max-w-[1150px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
          {/* card header */}
          <div className='relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-sky-50 via-white to-cyan-50 px-6 py-6'>
            <div className='pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-100/60 blur-2xl' />
            <div className='pointer-events-none absolute -left-8 -bottom-14 h-36 w-36 rounded-full bg-sky-100/70 blur-2xl' />

            <div className='relative flex flex-wrap items-start gap-4'>
              <div className='inline-flex h-12 w-12 items-center justify-center rounded-xl border border-sky-200 bg-white text-sky-600 shadow-sm'>
                <AppstoreOutlined className='text-xl' />
              </div>

              <div>
                <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700'>
                  Admin Panel
                </p>
                <h1 className='mt-1 text-2xl font-semibold leading-tight text-slate-900'>
                  {/* Subject but display as Category */}
                  Category Management
                </h1>
                <p className='mt-1 text-sm text-slate-600'>
                  Create and maintain article categories and visibility status.
                </p>

                <div className='mt-3 flex flex-wrap gap-2'>
                  <span className='rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-700'>
                    Content Taxonomy
                  </span>
                  <span className='rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700'>
                    {total} Category
                  </span>
                </div>
              </div>

              <div className='ml-auto rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm'>
                <p className='text-[11px] uppercase tracking-wide text-slate-500'>Total Records</p>
                <p className='text-2xl font-semibold leading-none text-slate-900'>{total}</p>
              </div>
            </div>
          </div>
          {/* card body */}
          <div className='p-6'>
            <div className='mb-4 flex flex-wrap items-center gap-3'>
              <Search placeholder="Search..."
                autoComplete='off'
                enterButton={<><SearchOutlined /> Search</>}
                size="large"
                id="search"
                onChange={(e) => setSearch(e.target.value)}
                loading={loading}
                onSearch={loadAsync}
                className='w-full md:max-w-[420px]'
              />
              <Button className='md:ml-auto'
                icon={<FileAddOutlined />}
                type="primary"
                size='large'
                onClick={handClickNew}>
                New Category
              </Button>
            </div>
            <Table dataSource={data}
              loading={loading}
              rowKey={(data: Subject) => data.id as number}
              pagination={false}
              scroll={{ x: 980 }}
              className='[&_.ant-table-thead>tr>th]:bg-slate-50 [&_.ant-table-thead>tr>th]:text-slate-700'>

              <Column title="Id" dataIndex="id" width={80} />
              <Column title="Category" dataIndex="category" key="category" />
              <Column title="Slug" dataIndex="slug" key="slug" />
              <Column title="Active" dataIndex="active" key="active" render={(active) => (
                active ? (
                  <span className='rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700'>Active</span>
                ) : (
                  <span className='rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-700'>Inactive</span>
                )
              )} />

              <Column title="Action" key="action"
                width={130}
                render={(_, data: Subject) => (
                  <Space size="small">

                    <Button
                      title='Edit subject'
                      icon={<EditOutlined />} onClick={() => handleEditClick(data.id ? data.id : 0)} />

                    <Button danger
                      title='Delete subject'
                      onClick={() => (
                        modal.confirm({
                          title: 'Delete?',
                          icon: <QuestionCircleOutlined />,
                          content: 'Are you sure you want to delete this data?',
                          okText: 'Yes',
                          cancelText: 'No',
                          onOk() {
                            handleDeleteClick(data.id ? data.id : 0)
                          }
                        })
                      )}
                      icon={<DeleteOutlined />} />
                  </Space>
                )}
              />
            </Table>

            <div className='mt-5 flex justify-end'>
              <Pagination
                onChange={onPageChange}
                current={page}
                defaultCurrent={1}
                showSizeChanger
                total={total}
                showTotal={(value, range) => `${range[0]}-${range[1]} of ${value} items`}
              />
            </div>

          </div>
        </div>
        {/* card */}

      </div>


      {/* Modal with Cancel and Save button*/}
      <Modal
        open={open}
        title={<span className='inline-flex items-center gap-2'><TagsOutlined /> {id > 0 ? 'Edit Category' : 'Create Category'}</span>}
        okText="Save"
        okButtonProps={{
          icon: <FileAddOutlined />,
          autoFocus: true,
          htmlType: 'submit',
        }}
        cancelText="Cancel"
        cancelButtonProps={{
          danger: true,
          icon: <CloseCircleOutlined />
        }}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            autoComplete='off'
            initialValues={{
              name: '',
              description: '',
              active: true,
            }}
            clearOnDestroy
            onFinish={(values) => onFinish(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="category"
          label="Category"
          validateStatus={errors.category ? 'error' : ''}
          help={errors.category ? errors.category[0] : ''}
        >
          <Input placeholder="Category name" />
        </Form.Item>

        {/* <Form.Item
          name="description"
          label="Description"
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description ? errors.description[0] : ''}
        >
          <Input.TextArea placeholder="Short description" rows={4} />
        </Form.Item> */}

        <Form.Item
          name="active"
          valuePropName="checked"
        >
          <Checkbox>Active</Checkbox>
        </Form.Item>

      </Modal>

    </>
  )
}

AdminCategoryIndex.layout = (page: any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default AdminCategoryIndex;
