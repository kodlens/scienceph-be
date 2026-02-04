import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";



import {
  Space,
  Table,
  Pagination,
  Button,
  Input,
  Select,
  Dropdown,
  App
} from "antd";

import { KeyboardEvent, useCallback, useRef, useState } from "react";
import axios from "axios";


import { useQuery } from "@tanstack/react-query";
import { dateFormat, truncate } from "@/helper/helperFunctions";
import ModalUpdatePublishDate, { ModalUpdatePublishDateHandle } from "@/Components/ModalUpdatePublishDate";
import { PageProps } from "@/types";
import { Article } from "@/types/article";
import { contextMenuItems } from "@/helper/contextMenuItems";
import { publisherMenuItems } from "@/helper/publisherMenuItems";


const { Column } = Table;


export default function PublisherArticleIndex({
  auth
}: { auth: PageProps }) {
  const { modal } = App.useApp();

  //const [form] = Form.useForm();

  const [status, setStatus] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const modalRef = useRef<ModalUpdatePublishDateHandle>(null)

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['posts', page, perPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        perpage: perPage.toString(),
        search: search.toString(),
        status: status.toString()
      })

      const res = await axios.get(`/publisher/get-articles?${params}`);
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  const handleStatusChange = (value: string) => {
    setStatus(value);
    //loadAsync(search, perPage, page)
  };

  const handleEditClick = (id: number) => {
    router.visit('/publisher/articles/' + id + '/edit');
  }


  const handleTrashClick = (id: number) => {
    modal.confirm({
      title: "Trash?",
      content: "Are you sure you want to move to trash this post?",
      onOk: async () => {
        const res = await axios.post("/publisher/articles-trash/" + id);
        if (res.data.status === "trashed") {
          refetch()
        }
      },
    });
  };

  const handleUnpublish = (id: number) => {
    modal.confirm({
      title: "Trash?",
      content: "Are you sure you want to set this article as unpublished?",
      onOk: async () => {
        const res = await axios.post("/publisher/articles-unpublish/" + id);
        if (res.data.status === "unpublish") {
          refetch()
        }
      },
    });
  };

   const handlePublish = (id: number) => {
    modal.confirm({
      title: "Trash?",
      content: "Are you sure you want to set this article as published?",
      onOk: async () => {
        const res = await axios.post("/publisher/articles-publish/" + id);
        if (res.data.status === "publish") {
          refetch()
        }
      },
    });
  };


  const handSearchClick = () => {
    refetch()
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") handSearchClick();
  }, [search, status]);

  return (
    <>
      <Head title="POST/ARTICLE"></Head>

      <div className="flex justify-center items-center">
        {/* card */}
        <div
          className="p-6 max-w-[1320px] overflow-auto mx-2 bg-white shadow-sm rounded-md
					sm:w-[740px]
					md:w-[1200px]"
        >
          {/* card header */}
          <div className="font-bold text-lg mb-4">
            LIST OF ARTICLES
          </div>

          {/* card body */}

          <div className="flex gap-2 mb-2">
            <Select
              style={{
                width: "200px",
              }}
              defaultValue=""
              onChange={handleStatusChange}
              options={[
                { label: "All", value: "" },
                {
                  label: "Submit for Publishing",
                  value: "submit",
                },
                { label: "Return to author", value: "return" },
              ]}
            />

            <Input
              placeholder="Search Id / Title"
              onKeyDown={handleKeyDown}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="primary" onClick={handSearchClick}>
              SEARCH
            </Button>
          </div>

          <Table dataSource={data?.data}
            loading={isFetching}
            rowKey={(data: Article) => data.id}
            pagination={false}
            expandable={{
              expandedRowRender: (article: Article) => (
                <>
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

                  <div className='flex gap-4'>
                    <div className='mt-4'>
                      <span className='font-bold text-[.8rem] mr-4 text-gray-600'>ENCODED:</span>
                      {article?.encoded_by && (
                        <span>
                          {article?.encoded_by?.lname}, {article?.encoded_by?.fname}
                        </span>
                      )}

                    </div>

                    <div className='mt-4'>
                      <span className='font-bold text-[.8rem] mr-4 text-gray-600'>MODIFIED:</span>
                      {article.modified_by && (
                        <span>
                          {article?.modified_by?.lname}, {article?.modified_by?.fname}
                        </span>)}
                    </div>
                  </div>
                </>
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
              render={(_, article) => (
                <>
                  {article.publish_date && dateFormat(article.publish_date)}
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
                    RETURN TO ENCODER
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
                    items: publisherMenuItems(
                      {
                        handleEditClick: () => handleEditClick(data.id),
                        handleTrashClick: () => handleTrashClick(data.id),
                        handlePublish: () => handlePublish(data.id),
                        handleUnpublish: () => handleUnpublish(data.id),
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

          <Pagination
            className="mt-4"
            onChange={(page, pageSize) => {
              setPerPage(pageSize)
              setPage(page)
              refetch()
            }}
            defaultCurrent={1}
            total={data?.total}
          />

        </div>
        {/* card */}


        {/* component in updateing date using modal */}
        <ModalUpdatePublishDate
          uri="/publisher/post-set-publish-date"
          ref={modalRef}
          onRefresh={() => refetch()} />
      </div>
    </>
  );
}

PublisherArticleIndex.layout = (page: any) => <Authenticated user={page.props.auth.user}>{page}</Authenticated>
