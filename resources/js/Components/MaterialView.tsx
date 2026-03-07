import { dateFormat } from "@/helper/helperFunctions";
import { Material } from "@/types/material";


export default function MaterialView({ material, className }: {material:Material, className:string } ) {
  return (
        <div className={`${className}`}>
            <hr />

            <div className='mt-6'>
                {/* <img className="m-auto" src={`/storage/featured_images/${post.featured_image}`} width={700} alt="Image" /> */}
            </div>
            {/* <div className='italic text-center'>{post.image_caption}</div> */}

            {/* <div className='mt-4 font-bold text-blue-900 text-lg'>{post.category.title}</div> */}
            <div className="font-bold text-2xl">{material.title}</div>
            <div className=" mt-2">

              <div className="ml-2 font-normal">
                 <span className="font-bold">AUTHOR:</span> {material.author}
                {material.publish_date && (
                  <>
                    &nbsp;
                    |<span className="ml-2 text-gray-500">
                      {dateFormat(material.publish_date as string)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className='mt-4 ck ck-content relative' dangerouslySetInnerHTML={{ __html: material.description ?? ''}}></div>

        </div>
    )
}
