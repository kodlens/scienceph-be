import { statusDropdownMenu } from "@/helper/statusMenu";
import { SelectAgency } from "@/Pages/Encoder/Article/partials/SelectAgency";
import { SelectCategory } from "@/Pages/Encoder/Article/partials/SelectCategory";
import { SelectRegion } from "@/Pages/Encoder/Article/partials/SelectRegion";
import { SelectSection } from "@/Pages/Encoder/Article/partials/SelectSection";
import { PageProps, User } from "@/types";
import { Form, Input, Select, DatePicker, ConfigProvider, Button, App, Checkbox } from "antd";
import Ckeditor from "./Ckeditor";
import { useEffect, useState } from "react";
import { Article } from "@/types/article";
import axios from "axios";
import { router } from "@inertiajs/react";
import { ProjectOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const CreateEditArticle = ({
  id,
  auth,
  article,
  ckLicense,
  uri
}: {
  id: number,
  auth: PageProps,
  article: Article,
  ckLicense: string,
  uri: string,
}) => {

  const [form] = Form.useForm();
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { message, modal } = App.useApp();

  useEffect(() => {
    if (id > 0) {
      getData();
    }
  }, []);

  const getData = () => {
    try {
      form.setFields([
        { name: "title", value: article.title },
        { name: "slug", value: article.alias },
        { name: "description", value: article.description },
        { name: "status", value: article.status ? article.status : 'draft' },
        { name: "source_url", value: article.source_url },
        { name: "category", value: article.category_id },
        { name: "section", value: article.section_id },
        { name: "agency", value: article.agency },
        { name: "region", value: article.region },
        { name: "author", value: article.author },
        { name: "is_publish", value: article.is_publish },
        { name: "is_press_release", value: article.is_press_release && article.is_press_release > 0 ? true : false },
        { name: "publish_date", value: article.publish_date ? dayjs(article.publish_date) : null },
      ]);

    } catch (err) { }
  };



  const submit = (values: Article) => {
    setLoading(true)
    setErrors({});

    if (id > 0) {
      axios.patch(`${uri}/${id}`, values).then(res => {

        if (res.data.status === 'updated') {
          modal.success({
            title: "Updated!",
            content: <div>Post successfully updated.</div>,
            onOk() {
              router.visit(`${uri}`);
            },
          });
        }
        setLoading(false)

      }).catch(err => {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          message.error(`${err}. Check your components`);
        }
        setLoading(false);
      })

    } else {
      axios.post(`${uri}`, values).then(res => {
        if (res.data.status === 'saved') {
          modal.success({
            title: "Saved!",
            content: <div>Post successfully saved.</div>,
            onOk() {

              router.visit(`${uri}`);
            },
          });
        }
        setLoading(false)
      }).catch(err => {
        if (err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          message.error(`${err}. Check your components`);
        }
        setLoading(false);
      })
    }
  };


  return (
    <Form
      layout="vertical"
      form={form}
      autoComplete="off"
      onFinish={submit}
      initialValues={{
        title: "",
        slug: '',
        category: "",
        section: "",
        status: 'draft',
        region: '',
        agency: 'DOST-STII',
        author: '',
        is_publish: 0,
        is_press_release: 0,
        source_url: '',
        publish_date: null
      }}
    >

      <div className="flex lg:flex-row-reverse flex-col-reverse gap-4">

        <div className="w-full lg:w-1/3">
          <Form.Item
            name="title"
            label="Title"
            validateStatus={errors.title ? "error" : ""}
            help={errors.title ? errors.title[0] : ""}
          >
            <Input placeholder="Title" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug (Read Only)"
            validateStatus={errors.slug ? "error" : ""}
            help={errors.slug ? errors.slug[0] : ""}
          >
            <Input disabled placeholder="Slug" />
          </Form.Item>


          <SelectSection errors={errors} />

          <SelectCategory errors={errors} />

          <Form.Item
            name="author"
            label="Author Name"
            className="w-full"
            validateStatus={errors.author ? "error" : ""}
            help={errors.author ? errors.author[0] : ""}
          >
            <Input placeholder="Author Name" />
          </Form.Item>

          <Form.Item
            name="status"
            className="w-full"
            label="Select Status"
            validateStatus={
              errors.status ? "error" : ""
            }
            help={errors.status ? errors.status[0] : ""}
          >
            <Select
              options={statusDropdownMenu((auth.user as User).role)}
            >
            </Select>
          </Form.Item>


          <Form.Item
            name="source_url"
            label="Source"
            className="w-full"
            validateStatus={errors.source_url ? "error" : ""}
            help={errors.source_url ? errors.source_url[0] : ""}
          >
            <Input placeholder="Source" />
          </Form.Item>

          <SelectAgency errors={errors} />

          <SelectRegion errors={errors} />



          <Form.Item
            name="publish_date"
            label="Publish Date"
            className="w-full"
            validateStatus={errors.publish_date ? "error" : ""}
            help={errors.publish_date ? errors.publish_date[0] : ""}
          >
            <DatePicker className="w-full" placeholder="Publish Date" />
          </Form.Item>

           <Form.Item
            name="is_press_release"
            valuePropName="checked"
            className="w-full"
            validateStatus={errors.is_press_release ? "error" : ""}
            help={errors.is_press_release ? errors.is_press_release[0] : ""}
          >
            <Checkbox>PRESS RELEASE</Checkbox>
          </Form.Item>

          <div className="flex mb-4 mt-6">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    defaultBg: 'green',
                    defaultColor: 'white',
                    defaultHoverBorderColor: 'green',

                    defaultActiveColor: 'white',
                    defaultActiveBorderColor: '#1a8c12',
                    defaultActiveBg: '#1a8c12',

                    defaultHoverBg: '#379b30',
                    defaultHoverColor: 'white',
                  }
                }
              }}>
              <Button
                className="ml-2"
                htmlType="submit"
                icon={<ProjectOutlined />}
                loading={loading}
              >
                Save Post/Article
              </Button>
            </ConfigProvider>

            <Button
              danger
              onClick={() => history.back()}
              className="ml-auto"
              icon={<ArrowLeftOutlined />}
              loading={loading}
              type="primary"
            >
              BACK
            </Button>
          </div>

        </div>



        {/* CKEditor */}
        <div className="w-full lg:w-2/3">

          {/* EDITOR CK WYSIWYG */}
          <div className="min-h-[300px] ">
            <Form.Item
              label="Body"
              name="description"
              className="prose-lg !max-w-none"
              validateStatus={
                errors.description ? "error" : ""
              }
              help={
                errors.description
                  ? errors.description[0]
                  : ""
              }
            >
              <Ckeditor post={article || undefined} form={form} ckLicense={ckLicense} />
            </Form.Item>
          </div>

        </div>

      </div>
      {/* flex contaner */}


    </Form>
  );
};

export default CreateEditArticle;