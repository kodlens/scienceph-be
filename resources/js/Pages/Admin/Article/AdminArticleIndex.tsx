
import {  Head, router } from '@inertiajs/react'

import {
 Input,
  Select,
  Button,
} from 'antd';

import { FileAddOutlined } from '@ant-design/icons';

import { KeyboardEvent, useState } from 'react'
import axios from 'axios';

import { useQuery } from '@tanstack/react-query';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { statusDropdownMenu } from '@/helper/statusMenu';
import TableArticles from '@/Components/TableArticles';

const AdminArticleIndex = () => {


  //const [perPage, setPerPage] = useState(10);
  const perPage = 10
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // const [errors, setErrors] = useState<any>({});
  // const [open, setOpen] = useState(false);
  // const [id, setId] = useState(0);
  const [status, setStatus] = useState('')


  const { data, isFetching, refetch } = useQuery({
    queryKey: ['posts', page, perPage],
    queryFn: async () => {
      const params = [
        `perpage=${perPage}`,
        `search=${search}`,
        `page=${page}`,
        `status=${status}`
      ].join('&');

      const res = await axios.get(`/admin/get-articles?${params}`);
      return res.data;
    },
  });


  // function openModalSetPublishDate(id: number): void {
  //   setId(id);
  //   setOpen(true);
  // }


  // const publish = (id:number) => {
  //   axios.post('/admin/posts.publish/' + id).then(res => {
  //     if (res.data.status === 'publish') {
  //       modal.info({
  //         title: 'Published!',
  //         content: 'Successfully published.'
  //       })
  //       refetch()
  //     }
  //   })
  // }


  // const archive = (id:number) => {
  //   axios.post('/admin/articles-archive/' + id).then(res => {
  //     if(res.data.status === 'archive') {
  //       modal.info({
  //         title: 'Archived!',
  //         content: 'Successfully archived.'
  //       })
  //       refetch()
  //     }
  //   })
  // }


  // const onPageChange = (index: number, perPage: number) => {
  //   setPage(index)
  //   setPerPage(perPage)
  // }


  // const handClickNew = () => {
  //   router.visit('/admin/articles/create');
  // }
  // const handleEditClick = (id: number) => {
  //   router.visit('/admin/articles/' + id + '/edit');
  // }
  // const handleTrashClick = (id: number) => {
  //   modal.confirm({
  //     title: 'Trash?',
  //     content: 'Are you sure you want to move this to trash?',
  //     onOk: async () => {
  //       const res = await axios.post('/admin/articles-trash/' + id);
  //       if (res.data.status === 'trashed') {
  //         refetch();
  //       }
  //     }
  //   })
  // }

  // const handleDeleteClick = (id: number) => {
  //   modal.confirm({
  //     title: 'Delete?',
  //     content: 'Are you sure you want to delete this post?',
  //     onOk: async () => {
  //       const res = await axios.delete('/admin/articles/' + id);
  //       if (res.data.status === 'deleted') {
  //         refetch();
  //       }
  //     }
  //   })
  // }

  const handSearchClick = () => {
    refetch()
  }


  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter')
      handSearchClick()
  }

  /**handle error image */
  // const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  //   e.currentTarget.src = '/img/no-img.png';
  // }

  // function onFinishSetPublishDate(values: Article): void {
  //   axios.post(`/admin/post-set-publish-date/${values.id}`, {
  //     publication_date: values.publish_date
  //   })
  //     .then((response) => {
  //       if (response.data.status === 'success') {
  //         notification.success({
  //           message: 'Success',
  //           description: 'Publish date updated successfully.',
  //         });
  //         refetch();
  //         setOpen(false);
  //         form.resetFields();
  //       } else {
  //         notification.error({
  //           message: 'Error',
  //           description: 'Failed to update publish date.',
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       notification.error({
  //         message: 'Error',
  //         description: 'An error occurred while updating the publish date.',
  //       });
  //       if (error.response && error.response.data.errors) {
  //         setErrors(error.response.data.errors);
  //       }
  //     });
  // }
  return (
    <>
      <Head title="Articles" />

      <div className="flex justify-center px-4">
        <div className="w-full max-w-[1300px] bg-white rounded-lg shadow-sm border border-slate-200 p-6">

          {/* ================= HEADER ================= */}
          <div className="mb-6 flex items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Science & Technology Articles
              </h1>
              <p className="text-sm text-slate-500">
                Manage, review, and publish science & technology articles
              </p>
            </div>

             <Button
              className='ml-auto'
                icon={<FileAddOutlined />}
                type="primary"
                onClick={() => router.visit('/admin/articles/create')}
              >
                New Article
              </Button>
          </div>

          {/* ================= FILTERS ================= */}
          <div className="flex flex-wrap items-center gap-3 mb-5 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Select
              className="w-[180px]"
              defaultValue=""
              onChange={setStatus}
              options={statusDropdownMenu('admin')}
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

          <TableArticles
            routePrefix='admin'
            data={data}
            isFetching={isFetching}
            refetch={refetch}
            page={page}
            paginationPageChange={(p)=>{
              setPage(p)
            }}
            showDelete={true}
            showEdit={true}
            showTrash={true}
            showPublish={true}
            showDraft={true}
            showView={true}
          />


        </div>
      </div>
    </>
  )
}

AdminArticleIndex.layout = (page: any) => <AuthenticatedLayout user={page.props.auth.user}>{page}</AuthenticatedLayout>
export default AdminArticleIndex;


