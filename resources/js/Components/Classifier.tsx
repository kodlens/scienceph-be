import { SubjectHeading } from '@/types/subject';
import { App, Button, Form, FormInstance, Input, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { BrushCleaning } from 'lucide-react';
import ModalSubjectHeadings from './ModalSubjectHeading';


type PageProps = {
  id:number;
  form: FormInstance
  errors: Record<string, string[]>
}
type AIResult = {
  id: number,
  score: number,
  analysis: string
}
type SubjectResult = {
  subject_heading_id: number,
  subject_heading?: string,
  score: number,
  analysis: string
}
const Classifier = ( { form, errors, id } : PageProps) => {

  const [loading, setLoading] = useState<boolean>(false);
  const { notification } = App.useApp();
  const [data, setData] = useState<SubjectResult[]>([]);
  const [subjectHeadings, setSubjectHeadings] = useState<SubjectHeading[]>([]);


  const handleClassification = () => {
    setLoading(true)
    const content = form.getFieldValue("description");

    if (content === undefined || content.trim() === "") {
      notification.error({
        message: "Empty Content",
        description: "Description is empty. Please provide content for classification.",
        duration: 5,
      });
      setLoading(false);
      return;
    }

    axios.post("/classify-content", { content: content }).then((res) => {

      if (res.data.results.length === 0) {
        notification.info({
          message: "No Relevant Subject Headings",
          description: "The AI did not find any relevant subject headings for this article.",
          duration: 5,
        });
      }

      const resData:AIResult[] = res.data.results

      const matchedHeadings = resData.map(datum => {
        const matched = subjectHeadings.find((subjHeading:SubjectHeading) => subjHeading.id === datum.id);
        return {
          subject_heading_id: datum.id,
          subject_heading: matched?.subject_heading || "",
          score: datum.score,
          analysis: datum.analysis
        };
      });

      setData(matchedHeadings);
      setLoading(false)

    }).catch((err) => {
      //message.error(`Classification failed: ${err.message}`);
      console.log(err);
      setLoading(false);
    });
  }

  const loadSubjectHeadings = async () => {
    const res = await axios.get(`/get-subject-headings`);
    setSubjectHeadings(res.data);
  };

  useEffect(() => {
    loadSubjectHeadings();
  }, []);

  //load data if edit mode
  useEffect(() => {
    if(id > 0){
      const subjH = form.getFieldValue('subject_headings');
      setData(subjH)
    }
  }, [form, id])


  useEffect(() => {

    form.setFieldValue("subject_headings", data.map(item => (
      {
        subject_heading_id: item.subject_heading_id,
        subject_heading: item.subject_heading,
        score: item.score,
        analysis: item.analysis
      }
    )));

  }, [data]);

  const handleDelete = (subjH_id:number) => {
    const index = data.findIndex(
      item => item.subject_heading_id === subjH_id
    );

    if (index !== -1) {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  }
  }

  return (
    <>
      <Button
        type="primary"
        loading={loading}
        onClick={() => {
          handleClassification();
        }}>
        Classify Information
      </Button>

      <div>
        <h3 className='my-2'>AI Classification Results:</h3>
        <Form.Item
          className="mt-4"
          validateStatus={errors.subject_headings ? "error" : ""}
          help={errors.subject_headings ? errors.subject_headings[0] : ""}>

          <Table
            rowKey="subject_heading_id"
            dataSource={data}
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
                title: "Subject Heading",
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
                render: (_, record) => (
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

          const existsInData = data.find(item => item.subject_heading_id === record.id);

          if(existsInData) {
            notification.warning({
              message: "Already Exists",
              description: "This subject heading is already in the classification results.",
              duration: 5,
              placement: 'bottomRight'
            });
            return;
          }

          setData([...data, {
              subject_heading_id: record.id,
              subject_heading: record.subject_heading,
              score: 1,
              analysis: "Manually added"
            }]);
        }} />

        <Button danger icon={<BrushCleaning size={15} />}
          onClick={()=>{
            setData([])
          }}
        >
          Remove All
        </Button>

        <Form.Item name="subject_headings" hidden>
          <Input />
        </Form.Item>


      </div>

    </>
  )
}

export default Classifier
