import { User } from "@/types";
import { Form, Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"

type Props = {
  errors?: Record<string, string[]>
}
export const SelectEncoderUser = ( { errors } : Props ) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<User[]>([]);

  const loadData = () => {
    setLoading(true);
    axios.get('/admin/load-encoder-users').then(res => {
      setData(res.data);
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData();
  }, [])

  const selectData = () => {
    return data.map(item => ({ value: item.id, label: item.lname + ', ' + item.fname }))
  }


  return (
    <>
      <Form.Item
        name="encoder_user_id"
        label="Select Encoder"
        className="w-full"
        validateStatus={errors?.category ? "error" : ""}
        help={errors?.category ? errors.category[0] : ""}
      >
        <Select loading={loading} options={data ? selectData() : []} allowClear/>
      </Form.Item>
    </>
  )
}
