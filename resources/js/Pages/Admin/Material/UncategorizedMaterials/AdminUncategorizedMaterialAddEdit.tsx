import { ReactNode, useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { CreateEditProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CreateEditMaterial from "@/Components/CreateEditMaterial";
import { App, Form, Input } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { Material } from "@/types/material";
import Ckeditor from "@/Components/Ckeditor";


const AdminUncategorizedMaterialAddEdit = ({
  id,
  auth,
  material,
  ckLicense,
  categories,
  authors,
  agencies,
  regions,
  regionalOffices,
  tags
}: CreateEditProps) => {

  const [form] = Form.useForm();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
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
        { name:"resource_type", value: material.resource_type ? material.resource_type : 'article' },
        { name: "title", value: material.title },
        { name: "slug", value: material.slug },
        { name: "description", value: material.description },
        { name: "status", value: material.status ? material.status : 'draft' },
        { name: "source_url", value: material.source_url },
        // { name: "resource_type", value: material.resource_type },
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

  const submit = (values: Material) => {
    setLoading(true)
    setErrors({});

    if (id > 0) {
      axios.patch(`admin/uncategorized-materials/${id}`, values).then(res => {
        values
        if (res.data.status === 'updated') {
          modal.success({
            title: "Updated!",
            content: <div>Post successfully updated.</div>,
            onOk() {
              router.visit(`admin/uncategorized-materials`);
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
      axios.post(`admin/uncategorized-materials`, values).then(res => {
        if (res.data.status === 'saved') {
          modal.success({
            title: "Saved!",
            content: <div>Post successfully saved.</div>,
            onOk() {

              router.visit(`admin/uncategorized-materials`);
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
    <>
      <Head title="Material" />

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
              ADD/EDIT MATERIAL
            </div>

            <div>

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


              </Form>

            </div>

            {/* <CreateEditMaterial
              id={id}
              auth={auth}
              material={material}
              ckLicense={ckLicense}
              categories={categories}
              uri="/admin/materials"
              authors={authors}
              agencies={agencies}
              regions={regions}
              tags={tags} regionalOffices={regionalOffices}/> */}

          </div>
          {/* end input card */}
        </div>
        {/* end card container */}
      </div>
      {/* card container */}
    </>
  );
}

AdminUncategorizedMaterialAddEdit.layout = (page: ReactNode) => (
  <AuthenticatedLayout user={(page as any).props.auth.user}>
    {page}
  </AuthenticatedLayout>
);

export default AdminUncategorizedMaterialAddEdit;
