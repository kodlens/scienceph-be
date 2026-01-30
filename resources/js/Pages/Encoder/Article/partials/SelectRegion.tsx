
import { Region } from "@/types/region";
import { Form, Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"

type Props = {
  errors: Record<string, string>
}

export const SelectRegion = ( { errors } : Props ) => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Region[]>([]);

  const loadData = () => {
    setLoading(true);
    axios.get('/get-regions').then(res => {
      setData(res.data);
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData();
  }, [])

  const selectData = () => {
    return data.map(item => ({ value: item.id, label: item.name }))
  }


  return (
    <>
      <Form.Item
        name="region"
        label="Select Region"
        className="w-full"
        validateStatus={errors.region ? "error" : ""}
        help={errors.region ? errors.region[0] : ""}
      >
        <Select loading={loading} options={data ? selectData() : []} />
      </Form.Item>
    </>
  )
}
