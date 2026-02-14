import { dateFormat } from "@/helper/helperFunctions";
import { Article } from "@/types/article";


export default function ArticleView({ article, className }: {article:Article, className:string } ) {
  return (
        <div className={`${className}`}>
            <hr />

            <div className='mt-6'>
                {/* <img className="m-auto" src={`/storage/featured_images/${post.featured_image}`} width={700} alt="Image" /> */}
            </div>
            {/* <div className='italic text-center'>{post.image_caption}</div> */}

            {/* <div className='mt-4 font-bold text-blue-900 text-lg'>{post.category.title}</div> */}
            <div className="font-bold text-2xl">{article.title}</div>
            <div className=" mt-2">

              <div className="ml-2 font-normal">
                 <span className="font-bold">AUTHOR:</span> {article.author}
                {article.publish_date && (
                  <>
                    &nbsp;
                    |<span className="ml-2 text-gray-500">
                      {dateFormat(article.publish_date as string)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className='mt-4 ck ck-content relative' dangerouslySetInnerHTML={{ __html: article.description ?? ''}}></div>


            {/* <div className='border-t py-4 my-6'>
                <div className="w-[300px] text-justify">
                    <div className="font-bold">{post.author.firstname} {post.author.lastname }</div>
                    <div>{post.author.bio}</div>
                </div>
            </div> */}
        </div>
    )
}
