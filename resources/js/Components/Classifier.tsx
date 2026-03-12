import { SubjectHeading } from '@/types/subject';
import { App, Button, Form, FormInstance, Input, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { Key } from 'react';

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
type NewSubjectResult = {
  subject_heading_id: number,
  subject_heading?: string,
  score: number,
  analysis: string
}
const Classifier = ( { form, errors, id } : PageProps) => {

  const [loading, setLoading] = useState<boolean>(false);
  const { notification } = App.useApp();
  const [data, setData] = useState<AIResult[]>([]);

  const [newData, setNewData] = useState<NewSubjectResult[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
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
      setData(res.data.results);
      setSelectedRowKeys([]);
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
      //form.setFieldValue('subject_headings', form.getFieldValue('subject_headings'))
      const subjH = form.getFieldValue('subject_headings');
      setNewData(subjH)
      //put ang ina!!!!
    }
  }, [form, id])

  useEffect(() => {

    if (data.length > 0) {

      console.log('useEffect for data');
      const matchedHeadings = data.map(datum => {
        const matched = subjectHeadings.find((subjHeading:SubjectHeading) => subjHeading.id === datum.id);
        //console.log('matched', matched);

        return {
          subject_heading_id: datum.id,
          subject_heading: matched?.subject_heading || "",
          score: datum.score,
          analysis: datum.analysis
        };
      });

      setNewData([...newData, ...matchedHeadings]);
    }
  }, [data]);


  useEffect(() => {

    if (selectedRowKeys.length > 0) {
      console.log('useEffect for selectedRowKeys');

      const selectedHeadings = newData.filter(item => selectedRowKeys.includes(item.subject_heading_id));
      form.setFieldValue("subject_headings", selectedHeadings.map(item => { return {
        subject_heading_id: item.subject_heading_id,
        subject_heading: item.subject_heading,
        score: item.score,
        analysis: item.analysis
      } }));
    } else {
      form.setFieldValue("subject_headings", []);
    }

  }, [selectedRowKeys]);

  useEffect(() => {
    if(id> 0){
      console.log('change newData', newData);
      //form.setFieldValue("subject_headings", newData)
    }

  }, [newData]);


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
            dataSource={newData}
            pagination={false}
            size="small"
            rowSelection={{
              selectedRowKeys,
              onChange: (newSelectedRowKeys) => {
                setSelectedRowKeys(newSelectedRowKeys);
              },
            }}
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
            ]}
          />
        </Form.Item>
       </div>


      <div className='flex gap-2'>
        <ModalSubjectHeadings onSelectSubjectHeading={(record) => {

          const existsInData = data.find(item => item.id === record.id);

          if(existsInData) {
            notification.warning({
              message: "Already Exists",
              description: "This subject heading is already in the classification results.",
              duration: 5,
              placement: 'bottomRight'
            });
            return;
          }

          const newSelected = [...data, {
            id: record.id,
            subject_heading_id: record.id,
            subject_heading: record.subject_heading,
            score: 1,
            analysis: "Manually added"
          }];
          setData(newSelected);

          console.log(newSelected);

          //setSelectedRowKeys(newSelected.map(item => item.subject_heading_id));
        }} />

        <Button danger icon={<BrushCleaning size={15} />}
          onClick={()=>{

          }}
        >
          Remove
        </Button>

        <Form.Item name="subject_headings" hidden>
          <Input />
        </Form.Item>


      </div>

    </>
  )
}

export default Classifier
