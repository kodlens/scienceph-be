import { Modal, Form, Input, Select, App } from 'antd'
import { useEffect, useState } from 'react'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { User } from '@/types'
import axios from 'axios'


type Props = {
  id:number
  modalOpen: boolean
  onClose: () => void
  refetch: () => void
}
const ModalCreateEditUser = ({ id, modalOpen, onClose, refetch }: Props) => {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(modalOpen)
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const { notification } = App.useApp();

  const getUser = (userId: number) => {
    axios.get<User>(`/admin/users/${userId}`).then(res=> {
      form.setFieldsValue(res.data)
    })
  }

  useEffect(() => {
    if(id > 0) {
      getUser(id)
    }
  }, [id])

  useEffect(() => {
    setOpen(modalOpen)
    setErrors({})
    form.resetFields()

  }, [modalOpen])

  /* ===================== SUBMIT ===================== */

  const onFinish = async (values: User) => {
    setLoading(true)
    try {
      if (id > 0) {
        await axios.put(`/admin/users/${id}`, values)
        notification.success({
          message: 'Updated',
          description: 'User updated successfully',
        })
      } else {
        await axios.post('/admin/users', values)
        notification.success({
          message: 'Saved',
          description: 'User created successfully',
        })
      }
      setLoading(false)
      onClose()
      refetch()
    } catch (err: any) {
      setLoading(false)
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors)
      }
    }
  }

  return (
    <>
      {/* MODAL */}
      <Modal
        open={open}
        width={720}
        title="User Information"
        okText="Save"
        cancelText="Cancel"
        onCancel={() => onClose()}
        okButtonProps={{ htmlType: 'submit', loading: loading }}
        destroyOnHidden

        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
            initialValues={{
              sex: 'MALE',
              role: null,
            }}
          >
            {dom}
          </Form>
        )}
      >
        <div className="flex flex-col">
          <Form.Item name="username" label="Username"
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username?.[0]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.[0]}>
            <Input />
          </Form.Item>

          <Form.Item name="lname" label="Last Name"
            validateStatus={errors.lname ? 'error' : ''}
            help={errors.lname?.[0]}>
            <Input />
          </Form.Item>

          <Form.Item name="fname" label="First Name"
            validateStatus={errors.fname ? 'error' : ''}
            help={errors.fname?.[0]}>
            <Input />
          </Form.Item>

          <Form.Item name="mname" label="Middle Name">
            <Input />
          </Form.Item>

          <Form.Item name="role" label="Role"
            validateStatus={errors.role ? 'error' : ''}
            help={errors.role?.[0]}>
            <Select
              options={[
                { value: 'encoder', label: 'ENCODER' },
                { value: 'publisher', label: 'PUBLISHER' },
                { value: 'admin', label: 'ADMINISTRATOR' },
              ]}
            />
          </Form.Item>
        </div>

        {id === 0 && (
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Account Password
            </p>

            <Form.Item name="password" label="Password"
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password?.[0]}>
              <Input.Password
                iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="password_confirmation"
              label="Confirm Password"
              validateStatus={errors.password_confirmation ? 'error' : ''}
              help={errors.password_confirmation?.[0]}
            >
              <Input.Password
                iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          </div>
        )}
      </Modal>
    </>
  )
}

export default ModalCreateEditUser
