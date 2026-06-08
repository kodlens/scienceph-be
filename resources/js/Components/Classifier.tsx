import { SubjectHeading } from '@/types/subject';
import { App, Button, Form, FormInstance, Input, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { BrushCleaning } from 'lucide-react';
import ModalSubjectHeadings from './ModalSubjectHeading';


type PageProps = {
  form: FormInstance
  errors: Record<string, string[]>
}
type AIResult = {
  id: number,
  score: number,
  analysis: string
}

// type SubjectResult = {
//   subject_heading_id: number,
//   subject_heading?: string,
//   score: number,
//   analysis: string
// }

const Classifier = ( { form, errors } : PageProps) => {

  const subjectHeadingsForm = Form.useWatch(
    "subject_headings",
    form
  ) || [];

  const [loading, setLoading] = useState<boolean>(false);
  const { notification, message } = App.useApp();
 // const [data, setData] = useState<SubjectResult[]>([]);
  const [subjectHList, setSubjectHList] = useState<SubjectHeading[]>([]);


  const handleClassification = () => {
    setLoading(true)
    const content = form.getFieldValue("description");

    if (content === undefined || content.trim() === "") {
      notification.error({
        message: "Empty Content",
        description: "Content is empty. Please provide content for classification.",
        duration: 5,
      });
      setLoading(false);
      return;
    }

    axios.post("/classify-content", { content: content }).then((res) => {

      if (res.data.results.length === 0) {
        notification.info({
          message: "No Relevant Topics",
          description: "The AI did not find any relevant topics for this article.",
          duration: 5,
        });
      }

      const resData:AIResult[] = res.data.results

      const matchedHeadings = resData.map(datum => {
        const matched = subjectHList.find((subjH:SubjectHeading) => subjH.id === datum.id);
        return {
          subject_heading_id: datum.id,
          subject_heading: matched?.subject_heading || "",
          score: datum.score,
          analysis: datum.analysis
        };
      });

      // setData(matchedHeadings);
      form.setFieldsValue({
        ...form.getFieldsValue(),
        subject_headings: matchedHeadings
      });
      setLoading(false)

    }).catch((error) => {
      //message.error(`Classification failed: ${err.message}`);
      if (axios.isAxiosError(error)) {
          // Network / server errors
          throw new Error(
              error.response?.data?.message ||
              error.message ||
              'Something went wrong'
          );

          throw error;
      }
      setLoading(false);
    });
  }

  const loadSubjectHeadings = async () => {
    const res = await axios.get(`/get-subject-headings`);
    setSubjectHList(res.data);
  };

  useEffect(() => {
    loadSubjectHeadings();
  }, []);

  const handleDelete = (subjH_id:number) => {
    const subjH = form.getFieldValue("subject_headings") || [];

    form.setFieldsValue({
      subject_headings: subjH.filter(
        (item: { subject_heading_id: number }) => item.subject_heading_id !== subjH_id
      ),
    });
  }

  return (
    <div className='border p-4 rounded-md'>

      <div className='mb-4 my-2 p-4 bg-orange-100 rounded-md'>
        Use the AI assistant below to automatically detect and select the most relevant topic from your content.
        Make sure the content above is not empty, then click <span className='font-bold'>Generate Topics</span> to begin analysis.
      </div>

      <Button
        type="primary"
        loading={loading}
        onClick={() => {
          handleClassification();
        }}>
        Generate Topics
      </Button>

      <div>
        <h3 className='my-2'>Generated Results:</h3>
        <Form.Item
          className="mt-4"
          validateStatus={errors.subject_headings ? "error" : ""}
          help={errors.subject_headings ? errors.subject_headings[0] : ""}>

          <Table
            rowKey="subject_heading_id"
            dataSource={ subjectHeadingsForm }
            pagination={false}
            size="small"
            columns={[
              {
                title: "Id",
                dataIndex: "subject_heading_id",
                key: "subject_heading_id",
                width: 120,
              },
              {
                title: "Topics",
                dataIndex: "subject_heading",
                key: "subject_heading",
                width: 200,
              },
              {
                title: "Score",
                dataIndex: "score",
                key: "score",
                width: 120,
              },
              {
                title: "Analysis",
                dataIndex: "analysis",
                key: "analysis",
              },
              {
                title: "Action",
                key: "action",
                width: 150,
                render: (_, record: { subject_heading_id: number }) => (
                  <>
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDelete(record.subject_heading_id)}
                    >
                      Delete
                    </Button>
                  </>
                ),
              },
            ]}
          />
        </Form.Item>
       </div>


      <div className='flex gap-2'>
        <ModalSubjectHeadings onSelectSubjectHeading={(record) => {
          const subjectHeadings = form.getFieldValue("subject_headings") || [];

          if(record.id > 0) {
            const exists = subjectHeadings.some(
              ( item: { subject_heading_id: number }) => item.subject_heading_id === record.id
            );
            if (exists) {
                message.warning('Topic already exists.');
              return;
            }
          }

          form.setFieldsValue({
            ...form.getFieldsValue(),
            subject_headings: [...subjectHeadings, {
              subject_heading_id: record.id,
              subject_heading: record.subject_heading,
              score: 0,
              analysis: 'Manully added'
            }]
          });

          message.success('Topic added successfully.');

        }} />

        <Button danger icon={<BrushCleaning size={15} />}
          onClick={()=>{
            form.setFieldsValue({
              ...form.getFieldsValue(),
              subject_headings: []
            });
          }}
        >
          Remove All
        </Button>

        <Form.Item name="subject_headings" hidden>
          <Input />
        </Form.Item>


      </div>

    </div>
  )
}

export default Classifier
