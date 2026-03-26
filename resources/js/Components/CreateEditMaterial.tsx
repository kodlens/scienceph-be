import { CreateEditProps, User } from "@/types";
import { Form, Input, Select, DatePicker, ConfigProvider, Button, App, Checkbox, Radio } from "antd";
import Ckeditor from "./Ckeditor";
import { useEffect, useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import { ProjectOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AuthorAutoComplete from "./AuthorAutoComplete";
import AgencyAutoComplete from "./AgencyAutoComplete";
import { statusDropdownMenu } from "@/helper/statusMenu";
import InputTitleWithValidation from "./InputTitleWithValidation";
import Classifier from "./Classifier";
import { Material } from "@/types/material";
import { SelectFilterType } from "./SelectFilterType";


const CreateEditMaterial = ({
  id,
  auth,
  material,
  ckLicense,
  categories,
  agencies,
  regions,
  //regionalOffices,
  authors,
  tags,
  uri
}: CreateEditProps) => {

  const [form] = Form.useForm();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { message, modal } = App.useApp();

  const role = auth.user?.role ? auth.user?.role.toLowerCase() : '';

  useEffect(() => {
    if (id > 0) {
      getData();
    }
  }, []);

  const getData = () => {
    try {
      form.setFields([
        { name:"resource_type", value: material.resource_type ? material.resource_type : 'article' },
        { name: "title", value: material.title },
        { name: "slug", value: material.slug },
        { name: "description", value: material.description },
        { name: "status", value: material.status ? material.status : 'draft' },
        { name: "source_url", value: material.source_url },
        { name: "resource_type", value: material.resource_type },
        { name: "category", value: material.category_id },
        // { name: "section", value: material.section_id },
        { name: "subject_headings", value: material.subject_headings },
        { name: "agency", value: material.agency },
        { name: "region", value: material.region },
        { name: "regional_office", value: material.regional_office },
        { name: "author", value: material.author },
        { name: 'filter_type', value: material.filter_type ? material.filter_type : '' },
        { name: "is_publish", value: material.is_publish },
        { name: "tags", value: material.tags ? material.tags.split(',') : [] },
        { name: "is_press_release", value: material.is_press_release && material.is_press_release > 0 ? true : false },
        { name: "publish_date", value: material.publish_date ? dayjs(material.publish_date) : null },
      ]);
      
      //console.log('material.subject_headings', material.subject_headings);
    } catch (err) { }
  };


  const handleSubmitAndPublish = () => {
    form
      .validateFields()
      .then((values) => {
        submit({ ...values, is_publish: true, status: 'publish', submit_status: 'save-publish' });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  const handleSubmitAndSetSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        submit({ ...values, status: 'submit', submit_status: 'save-submit' });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }

  const submit = (values: Material) => {
    setLoading(true)
    setErrors({});

    if (id > 0) {
      axios.patch(`${uri}/${id}`, values).then(res => {
        values
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
        resource_type: 'article',
        slug: '',
        category: "",
        status: 'draft',
        region: null,
        regional_office: null,
        agency: null,
        author: null,
        is_publish: 0,
        is_press_release: 0,
        source_url: '',
        subject_headings: [],
        publish_date: null,
        tags: null
      }}
    >


      <div className="w-[500px] mb-4">
        <Form.Item
          name="resource_type"
          label="Select Resource Type"
          validateStatus={errors.resource_type ? "error" : ""}
          help={errors.resource_type ? errors.resource_type[0] : ""}
        >
          <Radio.Group block
            buttonStyle="solid" 
            optionType="button"
            options={[
              { label: 'Article (SciencePH)', value: 'article' },
              { label: 'Information', value: 'information' },
            ]}  />

        </Form.Item>
      </div>
      

      <InputTitleWithValidation id={id} errors={errors} setErrors={setErrors}/>

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
            <Ckeditor post={material || undefined} form={form} ckLicense={ckLicense} />
          </Form.Item>
        </div>

      </div>

      <Classifier form={form} errors={errors} id={id}/>


      <div className="flex mt-4 flex-col md:gap-4 md:flex-row">
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

        <SelectFilterType errors={errors} />

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

      <div className="flex flex-col md:gap-4 md:flex-row">
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

      </div>

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
        {/* <ConfigProvider
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
            Save Information
          </Button>
        </ConfigProvider> */}
        <Button
          className="ml-2"
          htmlType="submit"
          icon={<ProjectOutlined />}
          loading={loading}
          type="primary"
          variant="outlined"
        >
          Save as Draft
        </Button>

        { role === 'administrator' || role === 'publisher' && (
            <Button
              className="ml-2"
              type="primary"
              onClick={handleSubmitAndPublish}
              icon={<ProjectOutlined />}
              loading={loading}
            >
              Save and Publish
            </Button>
          )
        }

        { role === 'encoder' && (
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
              onClick={handleSubmitAndSetSubmit}
              icon={<ProjectOutlined />}
              loading={loading}
            >
              Save and Submit
            </Button>

          </ConfigProvider>
            
          )
        }


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



      {/* flex contaner */}


    </Form>
  );
};

export default CreateEditMaterial;
