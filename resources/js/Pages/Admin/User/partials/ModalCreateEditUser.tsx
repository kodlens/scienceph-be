import { Modal, Form, Input, Select, App, Checkbox, FormInstance } from 'antd'
import { useEffect, useState } from 'react'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { User } from '@/types'
import axios from 'axios'


type Props = {
  user?:User
  modalOpen: boolean
  onClose: () => void
  refetch: () => void
  form: FormInstance
}
const ModalCreateEditUser = ({ user, modalOpen, onClose, refetch, form }: Props) => {
 // const [form] = Form.useForm()
  const [open, setOpen] = useState(modalOpen)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { notification } = App.useApp();


  useEffect(() => {
    setOpen(modalOpen)
    setErrors({})
    if(user) {
      form.setFieldsValue(user)
    }else{
      form.resetFields()
    }

  }, [modalOpen])

  /* ===================== SUBMIT ===================== */

  const onFinish = async (values: User) => {
    setLoading(true)
    try {
      if ((user ? user.id : 0) > 0) {
        await axios.put(`/admin/users/${user?.id}`, values)
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
        forceRender
        open={open}
        width={720}
        title="MANAGE USER"
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
              username: null,
              email: null,
              fname: null,
              mname: null,
              sex: 'MALE',
              role: null,
              is_ojt: false
            }}
          >

            {dom}
          </Form>
        )}
      >
        <div className="flex flex-col">

          <div className='border-t-2 border-b-2 border-blue-600 py-4 px-2'>
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


            <div className='flex gap-4'>
              <Form.Item name="lname" label="Last Name"
                className='w-full'
                validateStatus={errors.lname ? 'error' : ''}
                help={errors.lname?.[0]}>
                <Input />
              </Form.Item>

              <Form.Item name="fname" label="First Name"
                className='w-full'
                validateStatus={errors.fname ? 'error' : ''}
                help={errors.fname?.[0]}>
                <Input />
              </Form.Item>

            </div>

            <div className='flex gap-4'>
              <Form.Item name="mname" label="Middle Name"
                className='w-full'>
                <Input />
              </Form.Item>

              <Form.Item name="role" label="Role"
                className='w-full'
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



            { (user ? user.id : 0) === 0 && (
              <div className="mt-4 mb-4 rounded-md bg-gray-50 p-4">
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

            <Form.Item
              name="is_ojt"
              valuePropName="checked"
              className="w-full"
              validateStatus={errors.is_ojt ? "error" : ""}
              help={errors.is_ojt ? errors.is_ojt[0] : ""}
            >
              <Checkbox>Is OJT</Checkbox>
            </Form.Item>
          </div>

        </div>
      </Modal>
    </>
  )
}

export default ModalCreateEditUser
