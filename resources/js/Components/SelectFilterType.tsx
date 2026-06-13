
import { FilterType } from "@/types/resourceType";
import { Form, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react"

type Props = {
  errors: Record<string, unknown[]>
}
export const SelectFilterType = ( { errors } : Props ) => {
  const [loading, setLoading] = useState(false);
  const [filterTypes, setFilterTypes] = useState<FilterType[]>([]);

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

  const instruction = "Select the appropriate filter type that best categorizes the material. This classification helps in organizing and retrieving materials based on their content and subject matter. Choose the filter type that most accurately reflects the material's focus to ensure it is easily discoverable by users searching for related topics."

  return (
    <>
      <Form.Item
        tooltip={{
          title: instruction ,
          color: '#234d99'
         }}
        name="filter_type"
        label="Select Filter Type"
        className="w-full"
        validateStatus={errors.filter_type ? "error" : ""}
        help={errors.filter_type ? errors.filter_type[0] as string : ""}
      >
        <Select loading={loading} options={filterTypes ? selectData() : []} allowClear/>
      </Form.Item>
    </>
  )
}
