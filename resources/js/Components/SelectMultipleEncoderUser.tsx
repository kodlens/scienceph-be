
import { User } from "@/types";
import {  Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"

type Props = {
  value?: number;
  onChange?: (value: number) => void;
}

export const SelectMultipleEncoderUser = ( {value, onChange } : Props) => {
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
      <Select loading={loading} 
        className="w-full"
        value={value}
        onChange={onChange}
        options={users ? selectData() : []} allowClear/>
    </>
  )
}
