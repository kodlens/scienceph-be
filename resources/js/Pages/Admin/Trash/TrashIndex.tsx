import Authenticated from '@/Layouts/AuthenticatedLayout'
import { PageProps } from '@/types'
import { Head } from '@inertiajs/react'

import {

  EyeOutlined,
} from '@ant-design/icons';

import {
  Space, Table,
  Pagination, Button,
  Input,
  Dropdown,
  MenuProps,
  App
} from 'antd';


import React, { KeyboardEvent, useEffect, useState } from 'react'
import axios from 'axios';


const { Column } = Table;

interface PostResponse {
  data: any[]
  //data: Post[];
  total: number;
}

// interface Option {
//   label: string;
//   value: string;
// }


import dayjs from 'dayjs';
import { Article } from '@/types/article';
import { truncate } from '@/helper/helperFunctions';

const dateFormat = (item: Date): string => {
  return dayjs(item).format('MMM-DD-YYYY')
}

export default function TrashIndex(
  { auth}:
    PageProps) {

  const { modal } = App.useApp();


  const [data, setData] = useState<Article[]>([]);

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');


  const createMenuItems = (data: Article) => {

    const items: MenuProps['items'] = [];



    // if (paramPermissions.includes('trashes.destroy')) {
    //   items.push(
    //     {
    //       key: 'trashes.destroy',
    //       icon: <ProjectOutlined />,
    //       label: 'Submit for Publishing',
    //       onClick: () => {
    //         axios.delete('/panel/trashes/' + data.id).then(res => {
    //           if (res.data.status === 'destroy') {
    //             modal.info({
    //               title: 'Deleted!',
    //               content: 'Successfully deleted.'
    //             })
    //             loadAsync(search, perPage, page)
    //           }
    //         })
    //       },
    //     });
    // }

    //open for all
    items.push({
      label: 'View',
      key: '7',
      icon: <EyeOutlined />,
      onClick: () => {
        modal.info({
          width: 1024,
          title: 'Article Display',
          content: (
            <div>
              <hr />
              <div className="font-bold text-2xl">{data.title}</div>
              <div className='mt-4 ck ck-content relative' dangerouslySetInnerHTML={{ __html: data.description ?? '' }}></div>
            </div>
          ),
          onOk() { },
        });
      },
    });

    return items;
  }


  const loadAsync = async (
    search: string,
    perPage: number,
    page: number
  ) => {

    setLoading(true)

    const params = [
      `perpage=${perPage}`,
      `search=${search}`,
      `page=${page}`,
      `status=${status}`
    ].join('&');
    try {
      const res = await axios.get<PostResponse>(`/admin/get-trashes?${params}`);
      setData(res.data.data)
      setTotal(res.data.total)
      setLoading(false)

    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  useEffect(() => {

    loadAsync('', perPage, page);


  }, [perPage, page])



  const onPageChange = (index: number, perPage: number) => {
    setPage(index)
    setPerPage(perPage)
  }



  const handSearchClick = () => {
    loadAsync(search, perPage, page);
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter')
      handSearchClick()
  }

  /**handle error image */
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/img/no-img.png';
  }

  // const bgColor = (color: string) => {

  // }


  return (

    <Authenticated user={auth.user}>
      <Head title="POST/ARTICLE"></Head>

      <div className='flex mt-10 justify-center items-center'>
        {/* card */}
        <div className='p-6 w-[1320px] overflow-auto mx-2 bg-white shadow-sm rounded-md
					sm:w-[740px]
					md:w-[1200px]'>
          {/* card header */}
          <div className="font-bold mb-4">List of Articles</div>
          {/* card body */}

          <div className='flex gap-2 mb-2'>
            {/* <Select
							style={{
								width: '200px'
							}}

							defaultValue=""
							options={[
								{ label: 'All', value: '' },
								...statuses.map(status => ({

									label: status.status,
									value: status.status_id
								}))]
							}
						/> */}

            <Input placeholder="Search Title"
              onKeyDown={handleKeyDown}
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type='primary' onClick={handSearchClick}>SEARCH</Button>
          </div>

          {/* {
						permissions.includes('posts.create') && (
							<div className='flex flex-end my-2'>
								<Button className='ml-auto'
									icon={<FileAddOutlined />}
									type="primary" onClick={handClickNew}>
									NEW
								</Button>
							</div>
						)} */}

          <div>

            <Table dataSource={data}
              loading={loading}
              rowKey={(data) => data.id}
              pagination={false}>

              <Column title="Img" dataIndex="featured_image"
                render={(featured_image) => (
                  (
                    <div className="h-[40px] w-[40px]">
                      <img src={`/storage/featured_images/${featured_image}`}
                        onError={handleImageError} />
                    </div>
                  )

                )} />

              <Column title="Id" dataIndex="id" />
              <Column title="Title" dataIndex="title" key="title" />
              <Column title="Excerpt"
                dataIndex="excerpt"
                key="excerpt"
                render={(excerpt) => (
                  <span>{excerpt ? truncate(excerpt, 10) : ''}</span>
                )}
              />

              {/* <Column title="Author" dataIndex="author" key="author"
								render={(author:{author:string}) => {
									return (
										<>
											{author?.author}
										</>
									)
								}}
							/> */}

              <Column title="Publication Date" dataIndex="publication_date" key="publication_date"
                render={(publication_date) => {
                  return (
                    <>
                      {publication_date && dateFormat(publication_date)}
                    </>
                  )
                }}
              />

              <Column title="Status" dataIndex="status" key="status" render={(status) => {
                return (
                  <div className={"font-bold text-white text-center text-[10px] px-2 py-1 rounded-full"}
                    style={{
                      backgroundColor: `${status?.bgcolor}`
                    }}>{status?.status}
                  </div>
                )
              }}
              />

              <Column title="Featured" dataIndex="is_featured" key="is_featured" render={(is_featured) => (

                is_featured ? (
                  <span className='bg-green-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>YES</span>

                ) : (
                  <span className='bg-red-600 font-bold text-white text-[10px] px-2 py-1 rounded-full'>NO</span>
                )

              )} />
              <Column title="Action" key="action"
                render={(_, data: Article) => (
                  <Space size="small">
                    <Dropdown.Button menu={{ items: createMenuItems(data) }} type='primary'>
                      Options
                    </Dropdown.Button>

                  </Space>
                )}
              />
            </Table>

            <Pagination className='my-10'
              onChange={onPageChange}
              defaultCurrent={1}
              pageSize={5}
              total={total} />


          </div>
        </div>
        {/* card */}

      </div>

    </Authenticated>
  )
}
