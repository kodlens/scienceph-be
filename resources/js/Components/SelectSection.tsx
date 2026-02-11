import { Section } from "@/types/section";
import { Select } from "antd"
  type Props = {
    errors: Record<string, string>
    sections: Section[]
  }
export const SelectSection = ({ sections } : Props) => {

  const selectSections = () => {
    return sections.map(section => ({ value: section.id, label: section.name }))
  }

  return (
   <Select options={sections ? selectSections() : [] }  allowClear/>
  )
}
