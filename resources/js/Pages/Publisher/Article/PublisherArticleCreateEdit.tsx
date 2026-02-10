import { ReactNode } from "react";
import { Head } from "@inertiajs/react";
import { CreateEditProps } from "@/types";
import CreateEditArticle from "@/Components/CreateEditArticle";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";


const PublisherArticleCreateEdit = ({
  id,
  auth,
  article,
  ckLicense,
  sections,
  categories,
  authors,
  agencies,
  regions,
  regionalOffices,
  tags
}: CreateEditProps) => {

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

            <CreateEditArticle
              id={id}
              auth={auth}
              article={article}
              ckLicense={ckLicense}
              sections={sections}
              categories={categories}
              uri="/publisher/articles"
              authors={authors}
              agencies={agencies}
              regions={regions}
              tags={tags} regionalOffices={regionalOffices}            />

          </div>
          {/* end input card */}
        </div>
        {/* end card container */}
      </div>
      {/* card container */}
    </>
  );
}

export default PublisherArticleCreateEdit;

PublisherArticleCreateEdit.layout = (page: ReactNode) => (
  <AuthenticatedLayout user={(page as any).props.auth.user}>
    {page}
  </AuthenticatedLayout>
);
