import { App, Button, Form, Input, Select } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { ProfileOutlined, SaveOutlined } from "@ant-design/icons";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const MyAccount = ({ auth }: PageProps) => {

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm()
  const {  modal } = App.useApp();

  const loadAuthUser = () => {
    form.setFieldValue('username', auth.user.username)
    form.setFieldValue('lname', auth.user.lname)
    form.setFieldValue('fname', auth.user.fname)
    form.setFieldValue('mname', auth.user.mname)
    form.setFieldValue('sex', auth.user.sex)
  }

  useEffect(() => {
    loadAuthUser()
  }, [])

  const submit = (values: any) => {
    setLoading(true)
    axios.patch('/my-account-update', values).then(res => {
      if (res.data.status === "updated") {
        setLoading(false)

        modal.success({
          title: "Updated!",
          content: <div>Your account successfully updated.</div>,
          onOk() {
            router.reload();
          },
        });
      }
    }).catch(err => {
      setLoading(false)

      if (err.response.status === 422) {
        setErrors(err.response.data.errors)
      }
    })
  }


  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[980px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-teal-50 px-6 py-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-100/60 blur-2xl" />
          <div className="pointer-events-none absolute -left-8 -bottom-14 h-36 w-36 rounded-full bg-teal-100/70 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-200 bg-white text-cyan-600 shadow-sm">
              <ProfileOutlined className="text-xl" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-700">Account Settings</p>
              <h1 className="mt-1 text-2xl font-semibold leading-tight text-slate-900">My Account</h1>
              <p className="mt-1 text-sm text-slate-600">Keep your personal information up to date.</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Form form={form} layout="vertical"
            onFinish={submit}
            autoComplete='off'
            initialValues={{
              username: '',
              lname: '',
              fname: '',
              mname: '',
              sex: '',
            }}>

            <div className="grid gap-4 md:grid-cols-2">
              <Form.Item label="Username"
                name="username"
                validateStatus={errors?.username ? 'error' : ''}
                help={errors?.username ? errors?.username[0] : ''}
              >
                <Input placeholder="Username" disabled size="large" />
              </Form.Item>

              <Form.Item name="sex"
                label="Sex"
                validateStatus={errors.sex ? "error" : ""}
                help={errors.sex ? errors.sex[0] : ""}
              >
                <Select size="large">
                  <Select.Option value="MALE">MALE</Select.Option>
                  <Select.Option value="FEMALE">FEMALE</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Form.Item label="Last Name" name="lname"
                validateStatus={errors?.lname ? 'error' : ''}
                help={errors?.lname ? errors?.lname[0] : ''}
              >
                <Input placeholder="Last Name" size="large" />
              </Form.Item>

              <Form.Item label="First Name" name="fname"
                validateStatus={errors?.fname ? 'error' : ''}
                help={errors?.fname ? errors?.fname[0] : ''}
              >
                <Input placeholder="First Name" size="large" />
              </Form.Item>
            </div>

            <Form.Item label="Middle Name" name="mname"
              validateStatus={errors?.mname ? 'error' : ''}
              help={errors?.mname ? errors?.mname[0] : ''}
            >
              <Input placeholder="Middle Name" size="large" />
            </Form.Item>

            <div className="mt-2 flex justify-end">
              <Button
                htmlType="submit"
                type="primary"
                icon={<SaveOutlined />}
                size='large'
                loading={loading}>
                Save Changes
              </Button>
            </div>

          </Form>
        </div>
      </div>
    </div>
  )
}

export default MyAccount;

MyAccount.layout = (page: ReactNode) => (
  <AuthenticatedLayout user={(page as any).props.auth.user}>
    {page}
  </AuthenticatedLayout>
);
