import { Head, router } from '@inertiajs/react'

import {
  FileAddOutlined
} from '@ant-design/icons';

import {
  Space, Table,
  Pagination, Button,
  Input, Select,
  Dropdown,
  App
} from 'antd';
import { contextMenuItems } from '@/helper/contextMenuItems';

import { KeyboardEvent, ReactNode, useState } from 'react'
import axios from 'axios';

const { Column } = Table;


import EncoderLayout from '@/Layouts/EncoderLayout';
import { dateFormat, truncate } from '@/helper/helperFunctions';

import { useQuery } from '@tanstack/react-query';
import { Article } from '@/types/article';
import Error404 from '@/Components/Error404';
import { PageProps } from '@/types';

export default function EncoderPostIndex({ auth }: { auth: PageProps }) {

  const { modal } = App.useApp();

  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const perPage = 10;

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['posts', { perPage, page }],
    queryFn: async () => {
      const params = [
        `perpage=${perPage}`,
        `search=${search}`,
        `page=${page}`,
        `status=${status}`
      ].join('&');
      const res = await axios.get(`/encoder/get-articles?${params}`);
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  if (error) {
    return <Error404 error={error} />
  }

  const onPageChange = (index: number) => {
    setPage(index)
  }


  const handleStatusChange = (value: string) => {
    setStatus(value)
  }

  const handClickNew = () => {
    router.visit('/encoder/articles/create');
  }
  const handleEditClick = (id: number) => {
    router.visit('/encoder/articles/' + id + '/edit');
  }
  const handleTrashClick = (id: number) => {

    modal.confirm({
      title: 'Trash?',
      content: 'Are you sure you want to move this article to trash?',
      onOk: async () => {
        const res = await axios.post('/encoder/articles-trash/' + id);
        if (res.data.status === 'trashed') {
          refetch()
        }
      }
    })
  }

  const handSearchClick = () => {
    refetch()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter')
      handSearchClick()
  }

  return (

    <>
      <Head title="Post/Articles"></Head>

      <div className='flex w-full justify-center items-center'>
        {/* card */}
        <div className='p-6 w-[1320px] overflow-auto mx-2 bg-white shadow-sm rounded-md
					sm:w-[740px]
					md:w-[1300px]'>
          {/* card header */}
          <div className="font-bold text-lg mb-4">LIST OF POST/ARTICLES</div>

          {/* card body */}

          <div className='flex gap-2 mb-2'>
            <Select
              onChange={handleStatusChange}
              style={{
                width: '200px'
              }}

              defaultValue=""
              options={[
                { label: 'All', value: '' },
                { label: 'Draft', value: 'draft' },
                { label: 'Submit for Publishing', value: 'submit' }
              ]}
            />

            <Input placeholder="Search Title"
              onKeyDown={handleKeyDown}
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type='primary' onClick={handSearchClick}>SEARCH</Button>
          </div>

          {/* {
						permissions.includes('posts.create') && (

					)} */}
          <div className='flex flex-end my-2'>
            <Button className='ml-auto'
              icon={<FileAddOutlined />}
              type="primary" onClick={handClickNew}>
              NEW
            </Button>
          </div>

          <div>

            <Table dataSource={data?.data}
              loading={isFetching}
              rowKey={(data: Article) => data.id}
              pagination={false}
              expandable={{
                expandedRowRender: (article: Article) => (
                  <table className=''>
                    <thead>
                      <tr>
                        <th className='text-left py-1 text-sm text-gray-500'>Category</th>
                        <th className='text-left py-1 text-sm text-gray-500'>Section</th>
                        <th className='text-left py-1 text-sm text-gray-500'>Author</th>
                        <th className='text-left py-1 text-sm text-gray-500'>Modified At</th>
                        <th className='text-left py-1 text-sm text-gray-500'>Encoded At</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{article?.category?.name}</td>
                        <td>{article?.section?.name}</td>
                        <td>{article?.author}</td>
                        <td>
                          {
                            dateFormat(article?.modified_at ? article.modified_at.toString() : '')
                          }
                        </td>
                        <td>
                          {
                            dateFormat(article?.encoded_at ? article.encoded_at.toString() : '')
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )
              }}>
              <Column title="Id" dataIndex="id" />
              <Column title="Title" dataIndex="title" key="title" />
              <Column title="Description"
                key="description_text"
                render={(_, article: Article) => (
                  <>
                    <div>{article?.description_text ? truncate(article?.description_text, 15) : ''}</div>
                    <div className='mt-4'>
                      <span className='font-bold text-[.8rem] mr-4 text-gray-600'>PRESS RELEASE:</span>
                      <span className={article?.is_press_release ? 'text-green-600 bg-green-100 px-2 py-1 rounded text-[.8rem]' : 'text-red-600 bg-red-100 px-2 py-1 rounded text-[.8rem]'}>
                        {article?.is_press_release ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </>
                )}
              />

              <Column title="Publication Date"
                dataIndex="publish_date"
                key="publish_date"
                render={(publish_date) => (
                  <>
                    {publish_date && dateFormat(publish_date)}
                  </>
                )}
              />

              <Column title="Status" dataIndex="status" key="status" render={(status) => (

                <div>
                  {status === 'submit' && (
                    <div className='bg-green-300 font-bold text-center text-[10px] px-2 py-1 rounded-full'>
                      SUBMIT FOR PUBLISHING
                    </div>
                  )}
                  {status === 'publish' && (
                    <div className='bg-green-200 font-bold text-center text-[10px] px-2 py-1 rounded-full'>
                      PUBLISHED
                    </div>
                  )}

                  {status === 'draft' && (
                    <div className='bg-orange-200 font-bold text-center text-[10px] px-2 py-1 rounded-full'>
                      DRAFT
                    </div>
                  )}
                  {status === 'return' && (
                    <div className='bg-red-200 font-bold text-center text-[10px] px-2 py-1 rounded-full'>
                      RETURN TO AUTHOR
                    </div>
                  )}

                </div>

              )}
              />

              <Column
                title="Date Created"
                dataIndex="created_at"
                key="created_at"
                render={(created_at) => (
                  <>
                    {created_at &&
                      dateFormat(created_at)}
                  </>
                )}
              />

              <Column title="Action" key="action"
                render={(_, data: Article) => (
                  <Space size="small">
                    <Dropdown trigger={['click']} menu={{
                      items: contextMenuItems(
                        {
                          article: data,
                          handleEditClick: () => handleEditClick(data.id),
                          handleTrashClick: () => handleTrashClick(data.id),
                          auth: auth
                        })
                    }} >
                      <Space>
                        <Button variant='outlined'>...</Button>
                      </Space>
                    </Dropdown>
                  </Space>
                )}
              />
            </Table>

            <Pagination className='mt-4'
              onChange={(i) => {
                onPageChange(i)
              }}
              defaultCurrent={1}
              total={data?.total} />
          </div>
        </div>
        {/* card */}

      </div>

    </>
  )
}


EncoderPostIndex.layout = (page: ReactNode) => (
  <EncoderLayout user={(page as any).props.auth.user}>
    {page}
  </EncoderLayout>
);
