import { Section } from "@/types/section";
import { Form, Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"

  type Props = {
    errors: Record<string, string>
  }
export const SelectSection = ({ errors } : Props) => {

  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);


  const loadSections = ( ) => {
    setLoading(true);
    axios.get('/get-sections').then(res => {
      setSections(res.data);
      setLoading(false)
    })
  }

  useEffect(() => {
    loadSections();
  }, [])

  const selectSections = () => {
    return sections.map(section => ({ value: section.id, label: section.name }))
  }


  return (
    <>
      <Form.Item
        name="section"
        label="Select Section"
        className="w-full"
        validateStatus={errors.section ? "error" : ""}
        help={errors.section ? errors.section[0] : ""}
      >
        <Select loading={loading} options={sections ? selectSections() : []} />
      </Form.Item>
    </>
  )
}
