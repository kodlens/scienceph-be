import { ReactNode } from "react";
import { Head } from "@inertiajs/react";
import { CreateEditProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CreateEditMaterial from "@/Components/CreateEditMaterial";


const AdminMaterialCreateEdit = ({
  id,
  auth,
  material,
  ckLicense,
  authors,
  agencies,
  regions,
  tags
}: CreateEditProps) => {

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

            <CreateEditMaterial
              id={id}
              auth={auth}
              material={material}
              ckLicense={ckLicense}
              uri="/admin/materials"
              authors={authors}
              agencies={agencies}
              regions={regions}
              tags={tags}          />

          </div>
          {/* end input card */}
        </div>
        {/* end card container */}
      </div>
      {/* card container */}
    </>
  );
}

export default AdminMaterialCreateEdit;

AdminMaterialCreateEdit.layout = (page: ReactNode) => (
  <AuthenticatedLayout user={(page as any).props.auth.user}>
    {page}
  </AuthenticatedLayout>
);
