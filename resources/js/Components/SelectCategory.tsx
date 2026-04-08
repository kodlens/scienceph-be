
import { Category } from "@/types/category";
import { Form, Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react"

type Props = {
  errors: Record<string, string[]>
}
export const SelectCategory = ( { errors } : Props ) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadData = () => {
    setLoading(true);
    axios.get('/get-categories').then(res => {
      setCategories(res.data);
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData();
  }, [])

  const selectData = () => {
    return categories.map(item => ({ value: item.id, label: item.category }))
  }


  return (
    <>
      <Form.Item
        name="category"
        label="Select Category"
        className="w-full"
        validateStatus={errors?.category ? "error" : ""}
        help={errors.category ? errors.category[0] : ""}
      >
        <Select loading={loading} options={categories ? selectData() : []} allowClear/>
      </Form.Item>
    </>
  )
}
