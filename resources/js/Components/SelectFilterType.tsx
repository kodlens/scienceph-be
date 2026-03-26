
import ResourceType from "@/types/resourceType";
import { Form, Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"

type Props = {
  errors: Record<string, string[]>
}
export const SelectFilterType = ( { errors } : Props ) => {
  const [loading, setLoading] = useState(false);
  const [filterTypes, setFilterTypes] = useState<ResourceType[]>([]);

  const loadData = () => {
    setLoading(true);
    axios.get('/get-filter-types').then(res => {
      setFilterTypes(res.data);
      setLoading(false)
    }).catch(err => {
      setLoading(false);
      console.error(err.response ? err.response.data : err.message);
    })
  }

  useEffect(() => {
    loadData();
  }, [])

  const selectData = () => {
    return filterTypes.map(item => ({ value: item.slug, label: item.name }))
  }


  return (
    <>
      <Form.Item
        name="filter_type"
        label="Select Filter Type"
        className="w-full"
        validateStatus={errors.filter_type ? "error" : ""}
        help={errors.filter_type ? errors.filter_type[0] : ""}
      >
        <Select loading={loading} options={filterTypes ? selectData() : []} allowClear/>
      </Form.Item>
    </>
  )
}
