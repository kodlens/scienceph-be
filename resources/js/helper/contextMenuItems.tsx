import { Article } from "@/types/article";
import { MenuProps } from "antd";
import modal from "antd/es/modal";
import axios from "axios";
import { ProjectOutlined, EditOutlined, PaperClipOutlined, DeleteOutlined } from "@ant-design/icons";
import { PageProps } from "@/types";

type Props = {
  article: Article;
  refetch: () => void;
  handleEditClick: (id: number) => void;
  handleTrashClick: (id: number) => void;
  auth: PageProps
}
export const contextMenuItems = ({ article, refetch, handleEditClick, handleTrashClick }: Props) => {

    const items: MenuProps['items'] = [];

    items.push(
        // {
        //   key: 'articles.submit-for-publishing',
        //   icon: <ProjectOutlined />,
        //   label: 'Submit for Publishing',
        //   onClick: () => {

        //     axios.post('/encoder/articles-submit-for-publishing/' + article.id).then(res => {
        //       if (res.data.status === 'submit-for-publishing') {
        //         modal.success({
        //           title: 'Submitted!',
        //           content: 'Successfully submitted.'
        //         })
        //         refetch()
        //       }
        //     })
        //   },
        // },
        {
          label: 'Edit',
          key: '2',
          disabled: true,
          
          icon: <EditOutlined />,
          onClick: () => handleEditClick(article.id),
        },
        {
          label: 'Draft',
          key: '1',
          icon: <PaperClipOutlined />,
          onClick: () => {

            axios.post('/encoder/articles-draft/' + article.id).then(res => {
              if (res.data.status === 'draft') {
                modal.success({
                  title: 'Draft!',
                  content: 'Successfully draft.'
                })
                refetch()
              }
            })
          },
        },
        {
          label: 'Trash',
          key: '3',
          icon: <DeleteOutlined />,
          onClick: () => handleTrashClick(article.id)
        },
      );

    return items;
  }