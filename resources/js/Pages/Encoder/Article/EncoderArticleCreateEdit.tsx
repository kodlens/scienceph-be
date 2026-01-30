import { ReactNode, useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";

import { ProjectOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import {
  App,
  Button,
  Form,
  Input,
  Select,
  Flex,
  ConfigProvider,
  DatePicker,
} from "antd";

import { PageProps, User } from "@/types";
import axios from "axios";

import EncoderLayout from "@/Layouts/EncoderLayout";
import Ckeditor from "@/Components/Ckeditor";
import SelectSubjects from "@/Components/SelectSubjects";
import dayjs from "dayjs";
import { statusDropdownMenu } from "@/helper/statusMenu";
import OllamaChat from "@/Components/OllamaChat";
import { Article } from "@/types/article";


const EncoderArticleCreateEdit = ({
  id,
  auth,
  article,
  ckLicense
}: {
  id: number,
  auth: PageProps,
  article: Article,
  ckLicense: string
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
        { name: "status", value: article.status },
        { name: "source_url", value: article.source_url },
        { name: "agency", value: article.agency },
        { name: "author", value: article.author },
        { name: "is_publish", value: article.is_publish },
        { name: "publish_date", value: article.publish_date ? dayjs(article.publish_date) : null },
      ]);
      console.log(article);

    } catch (err) { }
  };

  const submit = (values: Article) => {
    setLoading(true)
    setErrors({});

    if (id > 0) {
      axios.patch('/encoder/posts/' + id, values).then(res => {

        if (res.data.status === 'updated') {
          modal.success({
            title: "Updated!",
            content: <div>Post successfully updated.</div>,
            onOk() {
              router.visit("/encoder/posts");
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
      axios.post('/encoder/posts', values).then(res => {
        if (res.data.status === 'saved') {
          modal.success({
            title: "Saved!",
            content: <div>Post successfully saved.</div>,
            onOk() {

              router.visit("/encoder/posts");
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

  const handleClassification = () => {
    setLoading(true)
    const content = form.getFieldValue("description");
    console.log(content);

    axios.post("/classify-article", { content:content }).then((res) => {
      console.log(res.data);
      setLoading(false)

    })

  }

  return (
    <>
      <Head title="Article" />

      {/* card container */}
      <div className="">
        {/* card container */}
        <div
          className="flex justify-center flex-col
					lg:flex-row"
        >
          {/* card input */}
          <div className="bg-white p-6 mx-2 md:max-w-7xl w-full" >

            <div className="font-bold text-lg pb-2 mb-2 border-b">
              ADD/EDIT POST
            </div>

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
                agency: '',
                author: '',
                is_publish: 0,
                is_press_release: 0,
                source_url: '',
                publish_date: null,
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

                  <Flex gap="middle">

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
                  </Flex>

                  <Flex gap={`middle`}>
                    <Form.Item
                      name="source_url"
                      label="Source"
                      className="w-full"
                      validateStatus={errors.source_url ? "error" : ""}
                      help={errors.source_url ? errors.source_url[0] : ""}
                    >
                      <Input placeholder="Source" />
                    </Form.Item>

                    <Form.Item
                      name="agency"
                      label="Agency"
                      className="w-full"
                      validateStatus={errors.agency ? "error" : ""}
                      help={errors.agency ? errors.agency[0] : ""}
                    >
                      <Input placeholder="Agency" />
                    </Form.Item>


                  </Flex>

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
            </Form>
          </div>
          {/* end input card */}
        </div>
        {/* end card container */}
      </div>
      {/* card container */}
    </>
  );
}

export default EncoderArticleCreateEdit;

EncoderArticleCreateEdit.layout = (page: ReactNode) => (
  <EncoderLayout user={(page as any).props.auth.user}>
    {page}
  </EncoderLayout>
);
