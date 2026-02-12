import { statusDropdownMenu } from "@/helper/statusMenu";
import { CreateEditProps, User } from "@/types";
import { Form, Input, Select, DatePicker, ConfigProvider, Button, App, Checkbox } from "antd";
import Ckeditor from "./Ckeditor";
import { useEffect, useState } from "react";
import { Article } from "@/types/article";
import axios from "axios";
import { router } from "@inertiajs/react";
import { ProjectOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AuthorAutoComplete from "./AuthorAutoComplete";
import AgencyAutoComplete from "./AgencyAutoComplete";
const CreateEditArticle = ({
  id,
  auth,
  article,
  ckLicense,
  sections,
  categories,
  agencies,
  regions,
  regionalOffices,
  authors,
  tags,
  uri
}: CreateEditProps) => {

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
        { name: "regional_office", value: article.regional_office },
        { name: "author", value: article.author },
        { name: "is_publish", value: article.is_publish },
        { name: "tags", value: article.tags ? article.tags.split(',') : [] },
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
        title: '',
        slug: '',
        category: "",
        section: 1,
        status: 'draft',
        region: null,
        regional_office: null,
        agency: null,
        author: '',
        is_publish: 0,
        is_press_release: 0,
        source_url: '',
        publish_date: null,
        tags: null
      }}
    >

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

      <div className="flex flex-col md:flex-row gap-4">

        <Form.Item
          name="author"
          label="Author Name"
          className="w-full"
          validateStatus={errors.author ? "error" : ""}
          help={errors.author ? errors.author[0] : ""}
        >
          <AuthorAutoComplete authors={authors} />
        </Form.Item>

        <Form.Item
          name="publish_date"
          label="Publish Date"
          className="w-full"
          validateStatus={errors.publish_date ? "error" : ""}
          help={errors.publish_date ? errors.publish_date[0] : ""}
        >
          <DatePicker className="w-full" placeholder="Publish Date" />
        </Form.Item>
      </div>

      {/* CKEditor */}
      <div className="w-full">

        {/* EDITOR CK WYSIWYG */}
        <div className="min-h-[300px] ">
          <Form.Item
            label="Write your content here"
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
      <div className="flex gap-4">

        <div className="w-full">


          <div className="flex flex-col md:gap-4 md:flex-row">
            <Form.Item
              name="category"
              label="Select Category"
              className="w-full"
              validateStatus={errors.category ? "error" : ""}
              help={errors.category ? errors.category[0] : ""}
            >
              <Select
                options={categories ? categories.map(cat => ({ value: Number(cat.id), label: cat.name })) : [] }
                allowClear
                placeholder="Select Category"
              />
            </Form.Item>

            <Form.Item
              name="section"
              label="Select Section"
              className="w-full"
              validateStatus={errors.section ? "error" : ""}
              help={errors.section ? errors.section[0] : ""}
            >
              {/* <SelectSection sections={sections} errors={errors} /> */}
              <Select options={sections ? sections.map(section => ({ value: Number(section.id), label: section.name })) : [] }  allowClear/>
            </Form.Item>

          </div>

          <Form.Item
            name="source_url"
            label="Source URL"
            className="w-full"
            validateStatus={errors.source_url ? "error" : ""}
            help={errors.source_url ? errors.source_url[0] : ""}
          >
            <Input placeholder="Source URL" />
          </Form.Item>


          <div className="flex flex-col md:gap-4 md:flex-row">
            <Form.Item
              name="agency"
              label="Agency"
              className="w-full"
              validateStatus={errors.agency ? "error" : ""}
              help={errors.agency ? errors.agency[0] : ""}
            >
              {/* <Select options={agencies ? agencies.map(item => ({ value: item.code, label: item.code })) : [] }  allowClear/> */}
              <AgencyAutoComplete agencies={agencies} />
            </Form.Item>

            <Form.Item
              name="region"
              label="Select Region"
              className="w-full"
              validateStatus={errors.region ? "error" : ""}
              help={errors.region ? errors.region[0] : ""}
            >
              <Select options={regions ? regions.map(item => ({ value: item.name, label: item.name })) : [] }  allowClear/>
            </Form.Item>
          </div>

          <Form.Item
            name="regional_office"
            label="Select Region Office"
            className="w-full"
            validateStatus={errors.regional_office ? "error" : ""}
            help={errors.regional_office ? errors.regional_office[0] : ""}
          >
            <Select options={regionalOffices ? regionalOffices.map(item => ({ value: item.name, label: item.name })) : [] }  allowClear/>
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
            className="w-full"
            validateStatus={errors.tags ? "error" : ""}
            help={errors.tags ? errors.tags[0] : ""}
          >
            <Select
              loading={loading}
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Tags Mode"
              options={tags.map(item => ({ value: item, label: item }))}
            />
          </Form.Item>

          {/* <div className="flex flex-col md:gap-4 md:flex-row">
            <Form.Item
              name="status"
              className="w-full"
              label="Status (Read Only)"
              validateStatus={
                errors.status ? "error" : ""
              }
              help={errors.status ? errors.status[0] : ""}
            >
              <Select
                disabled
                options={statusDropdownMenu((auth.user as User).role)}
              >
              </Select>
            </Form.Item>

          </div> */}

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





      </div>
      {/* flex contaner */}


    </Form>
  );
};

export default CreateEditArticle;
