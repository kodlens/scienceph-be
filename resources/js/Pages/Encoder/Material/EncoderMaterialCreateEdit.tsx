import { ReactNode } from "react";
import { Head, router } from "@inertiajs/react";
import { ArrowLeftOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { CreateEditProps } from "@/types";
import EncoderLayout from "@/Layouts/EncoderLayout";
import CreateEditMaterial from "@/Components/CreateEditMaterial";

const EncoderMaterialCreateEdit = ({
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
  const isEditMode = Number(id) > 0;
  const pageTitle = isEditMode ? "Edit Material" : "Create Material";
  const pageDescription = isEditMode
    ? "Update content details, metadata, and classification before saving."
    : "Encode a new science and technology material with complete metadata.";

  return (
    <>
      <Head title={pageTitle} />

      <div className="flex justify-center">
        <div className="w-full max-w-[1300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-teal-50 via-white to-cyan-50 px-6 py-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-100/60 blur-2xl" />
            <div className="pointer-events-none absolute -left-8 -bottom-14 h-36 w-36 rounded-full bg-teal-100/70 blur-2xl" />

            <div className="relative flex flex-wrap items-start gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-teal-200 bg-white text-teal-600 shadow-sm">
                {isEditMode ? <EditOutlined className="text-xl" /> : <PlusCircleOutlined className="text-xl" />}
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                  Encoder Panel
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight text-slate-900">
                  {pageTitle}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {pageDescription}
                </p>
              </div>

              <Button
                className="ml-auto"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.visit('/encoder/materials')}
              >
                Back to Materials
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4 my-2 p-4 bg-orange-100 rounded-md">
              Review all required fields before saving.
            </div>

            <CreateEditMaterial
              id={id}
              auth={auth}
              material={material}
              ckLicense={ckLicense}
              categories={categories}
              uri="/encoder/materials"
              authors={authors}
              agencies={agencies}
              regions={regions}
              regionalOffices={regionalOffices}
              tags={tags}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EncoderMaterialCreateEdit;

EncoderMaterialCreateEdit.layout = (page: ReactNode) => (
  <EncoderLayout user={(page as any).props.auth.user}>
    {page}
  </EncoderLayout>
);
  0
