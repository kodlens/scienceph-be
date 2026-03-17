
import { User } from "@/types";
import { Form, Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"

type Props = {
  errors: Record<string, string>
}
export const SelectPublisherUser = ( { errors } : Props ) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const loadData = () => {
    setLoading(true);
    axios.get('/admin/load-users').then(res => {
      setUsers(res.data);
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData();
  }, [])

  const selectData = () => {
    return users.map(item => ({ value: item.id, label: item.lname + ', ' + item.fname }))
  }


  return (
    <>
      <Form.Item
        name="publisher_user_id"
        label="Select Publisher"
        className="w-full"
        validateStatus={errors.publisher_user_id ? "error" : ""}
        help={errors.publisher_user_id ? errors.publisher_user_id[0] : ""}
      >
        <Select loading={loading} options={users ? selectData() : []} allowClear/>
      </Form.Item>
    </>
  )
}
