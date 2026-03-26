import { Subject } from "@/types/subject";
import { Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
type PageProps = {
  onSelectSubject: (record: Subject) => void
}

const ModalSelectSubject = ( { onSelectSubject } : PageProps) => {

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadSubjects = async () => {
    // Load subject headings from the server or use static data
    // setSubjectHeadings(data);
    setLoading(true);
    axios.get(`/get-subjects`).then(res => {
      setSubjects(res.data);
      setLoading(false);
    }).catch(err => {
      setLoading(false);
      console.log(err);
    });
  }

  useEffect(() => {
    loadSubjects();
  }, []);



  return (
    <>
      <Select placeholder="Select a subject" 
        style={{ width: '100%' }} loading={loading} 
        allowClear
        onChange={(value) => {
          const selectedSubject = subjects.find(subject => subject.id === value);
          if (selectedSubject) {
            onSelectSubject(selectedSubject);
          }
      }}>

        {subjects.map((subject: Subject) => (
          <Select.Option key={subject.id} value={subject.id}>
            {subject.subject}
          </Select.Option>
        ))}
      </Select>
    
    </>
  )
}

export default ModalSelectSubject