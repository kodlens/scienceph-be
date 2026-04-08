import React, { useEffect } from 'react'
import { Button, Input, Modal, Table } from 'antd';
import { SubjectHeading } from '@/types/subject';
import axios from 'axios';
import { ListPlus } from 'lucide-react';
import ModalSelectSubject from './ModalSelectSubject';
import { Category } from '@/types/category';
type PageProps = {
  onSelectSubjectHeading: (record: SubjectHeading) => void
}
const ModalSubjectHeadings = ( { onSelectSubjectHeading } : PageProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [subjectHeadings, setSubjectHeadings] = React.useState<SubjectHeading[]>([]);
  const [search, setSearch] = React.useState<string>("");
  const [category, setCategory] = React.useState<Category>();

  const loadSubjectHeadings = () => {
    // Load subject headings from the server or use static data
    // setSubjectHeadings(data);
    setLoading(true);
    axios.get(`/get-subject-headings/${category ? category.id : 0}?search=${search}`).then(res => {
      setSubjectHeadings(res.data);
      setLoading(false);
    }).catch(err => {
      setLoading(false);
      console.log(err);

    });
  }


  useEffect(() => {
    loadSubjectHeadings();
  }, []);

  useEffect(() => {
    if(category) {
      loadSubjectHeadings();
    }
  }, [category]);

  const handleCancel = () => {
    setIsModalOpen(false);
  }

  const handleSelectSubjectHeading = (record: SubjectHeading) => () => {
    // Handle the selection of a subject heading (e.g., add it to the article)
    //("Selected Subject Heading:", record);
    // You can also close the modal after selection if desired
    onSelectSubjectHeading(record);
    setIsModalOpen(false);
  }
  return (
    <div>

      <Button
        icon={<ListPlus  size={15}/>}
        type='primary'
        onClick={() => setIsModalOpen(true)}>
        Add Manually
      </Button>

      <Modal
        title="Browse Category"
        open={isModalOpen}
        footer={null}
        destroyOnHidden
        onCancel={handleCancel}>

          <div>
            {/* <SelectSubjects form={undefined} /> */}
            <ModalSelectSubject onSelectCategory={(record)=> {
              setCategory(record);

            }}/>
          </div>

        <div className='my-2'>
          <Input placeholder="Search Subject Headings"
            disabled={loading}
            onChange={ (e) => setSearch(e.target.value) }
            onKeyDown={(e) => {
              if(e.key === 'Enter') {
                loadSubjectHeadings();
              }
            }} />
        </div>
        <Table
          loading={loading}
          dataSource={subjectHeadings}
          rowKey={(record) => record.id}
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id'
            },
            {
              title: 'Topics',
              dataIndex: 'subject_heading',
              key: 'subject_heading'
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <Button type="link" onClick={handleSelectSubjectHeading(record)}>
                  Add
                </Button>
              )
            }
          ]}
        ></Table>

      </Modal>

    </div>
  )
}

export default ModalSubjectHeadings

