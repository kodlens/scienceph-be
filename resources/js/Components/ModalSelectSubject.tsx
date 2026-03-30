import { Category } from "@/types/category";
import { Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
type PageProps = {
  onSelectCategory: (record: Category) => void
}

const ModalSelectSubject = ( { onSelectCategory } : PageProps) => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadSubjects = async () => {
    // Load subject headings from the server or use static data
    // setSubjectHeadings(data);
    setLoading(true);
    axios.get(`/get-categories`).then(res => {
      setCategories(res.data);
      setLoading(false);
    }).catch(err => {
      setLoading(false);
      console.log(err);
    });
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <>
      <Select placeholder="Select a category"
        style={{ width: '100%' }} loading={loading}
        allowClear
        onChange={(value) => {
          const selectedItem = categories.find(cat => cat.id === value);
          if (selectedItem) {
            onSelectCategory(selectedItem);
          }
      }}>

        {categories.map((cat: Category) => (
          <Select.Option key={cat.id} value={cat.id}>
            {cat.category}
          </Select.Option>
        ))}
      </Select>

    </>
  )
}

export default ModalSelectSubject
