import { Form, Input } from 'antd'
import axios from 'axios'
import { useState } from 'react'

type Props = {
  errors: Record<string, string[]>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  id:number
}
const InputTitleWithValidation = ({ id, errors, setErrors }: Props) => {
  const [loading, setLoading] = useState(false);
  const handleInputBlur = (value:string) => {
    setLoading(true)
    axios.post(`/material/validate-title/${id}?title=${value}`).then(()=> {
      setLoading(false)

      setErrors({})
    }).catch(err=> {
      setLoading(false)

      if(err.response.status === 422)
        setErrors(err.response.data.errors)
    })
  }
  return (
    <Form.Item
      name="title"
      label="Title"
      validateStatus={errors.title ? "error" : ""}
      help={errors.title ? errors.title[0] : ""}
    >
      <Input placeholder="Title"
        disabled={loading}
        onBlur={(e) => handleInputBlur(e.target.value)} />
    </Form.Item>
  )
}

export default InputTitleWithValidation
