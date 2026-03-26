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
import FilterType from '@/types/resourceType';

const { Column } = Table;
const { Search } = Input;


type PaginationMeta = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  data: FilterType[];
  to: number;
}

const AdminFilterTypeIndex = () => {

  const [form] = Form.useForm();

  const { notification, modal } = App.useApp();

  const [data, setData] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); //for modal

  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState<any>({});

  const sortBy = 'id.desc'
  const [id, setId] = useState(0);
  const loadAsync = async () => {

    setLoading(true)
    const params = [
      `search=${search}`,
      `perpage=${perPage}`,
      `sort_by=${sortBy}`,
      `page=${page}`
    ].join('&');

    try {
      const res = await axios.get<PaginationMeta>(`/admin/get-filter-types?${params}`);
      setData(res.data)
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
      const res = await axios.get<FilterType>(`/admin/filter-types/${id}`);
      form.setFields([
        { name: 'name', value: res.data.name },
        { name: 'active', value: res.data.active ? true : false },
      ]);
    } catch (err) {
      //console.log(err);
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      name: '',
      active: true,
    })
  }, [open]);


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
    const res = await axios.delete('/admin/filter-types/' + id);
    if (res.data.status === 'deleted') {
      notification.success({
        message: 'Deleted!',
        description: 'Filter Type successfully deleted.',
        placement: 'topRight'
      })
      loadAsync()
    }
  }

  const onFinish = async (values: FilterType) => {
    setLoading(true)
    if (id > 0) {
      try {
        const res = await axios.put('/admin/filter-types/' + id, values)
        if (res.data.status === 'updated') {
          notification.success({
            message: 'Updated!',
            description: 'Filter Type successfully updated.',
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
        const res = await axios.post('/admin/filter-types', values)
        if (res.data.status === 'saved') {
          notification.success({
            message: 'Saved!',
            description: 'Filter Type successfully saved.',
            placement: 'topRight'
          })
          setOpen(false)
          loadAsync()
        }
      } catch (err: any) {
          setLoading(false);

        if (err.response.status === 422) {
          setErrors(err.response.data.errors)
        }
      }
    }

    //throw new Error('Function not implemented.');
  }

  return (
    <>
      <Head title="Filter Type Management"></Head>

      <div className='flex justify-center'>

        {/* card */}
        <div className='w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
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
                  Resource Type Management
                </h1>
                <p className='mt-1 text-sm text-slate-600'>
                  Create and maintain resource types and visibility status.
                </p>
              </div>

              <div className='ml-auto rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm'>
                <p className='text-[11px] uppercase tracking-wide text-slate-500'>Total Records</p>
                <p className='text-2xl font-semibold leading-none text-slate-900'>{data ? (data.total as number) : 0}</p>
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
                New Resource Type
              </Button>
            </div>
            <Table dataSource={data ? data?.data : []}
              loading={loading}
              rowKey={(data: FilterType) => data.id as number}
              pagination={false}
              scroll={{ x: 980 }}
              className='[&_.ant-table-thead>tr>th]:bg-slate-50 [&_.ant-table-thead>tr>th]:text-slate-700'>

              <Column title="Id" dataIndex="id" width={80} />
              <Column title="Slug" dataIndex="slug" key="slug" />
              <Column title="Resource Type" dataIndex="name" key="name" />
              <Column title="Active" dataIndex="active" key="active" render={(active) => (
                active ? (
                  <span className='rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700'>Active</span>
                ) : (
                  <span className='rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-semibold text-rose-700'>Inactive</span>
                )
              )} />

              <Column title="Action" key="action"
                width={130}
                render={(_, data: FilterType) => (
                  <Space size="small">

                    <Button
                      title='Edit filter type'
                      icon={<EditOutlined />} onClick={() => handleEditClick(data.id ? data.id : 0)} />

                    <Button danger
                      title='Delete filter type'
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
                total={data?.total}
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
        title={<span className='inline-flex items-center gap-2'><TagsOutlined /> {id > 0 ? 'Edit Filter Type' : 'Create Filter Type'}</span>}
        okText="Save"
        loading={loading}
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
        onOk={() => form.submit()}
      >
        <Form
          layout="vertical"
          form={form}
          name="form_in_modal"
          autoComplete='off'
          initialValues={{
            name: '',
            active: true,
          }}
          onFinish={(values) => onFinish(values)}
        >

          <Form.Item
            name="name"
            label="Filter Type"
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name ? errors.name[0] : ''}
          >
            <Input placeholder="Filter Type name" />
          </Form.Item>

          <Form.Item
            name="active"
            valuePropName="checked"
          >
            <Checkbox>Active</Checkbox>
          </Form.Item>
              
        </Form>

      </Modal>

    </>
  )
}

AdminFilterTypeIndex.layout = (page: any) => <AdminLayout user={page.props.auth.user}>{page}</AdminLayout>
export default AdminFilterTypeIndex;
