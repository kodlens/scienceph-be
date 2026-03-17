
import { User } from "@/types";
import { Form, Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"

type Props = {
  errors: Record<string, string>
}
export const SelectEncoderUser = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const loadData = () => {
    setLoading(true);
    axios.get('/admin/load-encoder-users').then(res => {
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
      <Select loading={loading} style={{width: '80%'}} options={users ? selectData() : []} allowClear/>
    </>
  )
}
