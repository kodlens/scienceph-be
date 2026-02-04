import { ReactNode } from "react";
import { Head } from "@inertiajs/react";


import { CreateEditProps } from "@/types";
import EncoderLayout from "@/Layouts/EncoderLayout";
import CreateEditArticle from "@/Components/CreateEditArticle";


const EncoderArticleCreateEdit = ({
  id,
  auth,
  article,
  ckLicense,
  sections,
  categories,
  authors,
  agencies,
  regions,
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
              uri="/encoder/articles"
              authors={authors}
              agencies={agencies}
              regions={regions}
              tags={tags}
            />

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
