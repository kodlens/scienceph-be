import { Article } from "@/types/article";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export const encoderMenuItems = (
  {
    handleEditClick,
    handleTrashClick,
    article
  }:
  {
    handleEditClick: (id: number) => void,
    handleTrashClick: (id: number) => void,
    article: Article
  }) => {

    return [
      {
        label: 'Edit',
        key: 'encoder.articles.edit',
        icon: <EditOutlined />,
        onClick: () => handleEditClick(article.id),
      },
      {
        label: 'Trash',
        key: 'encoder.articles.trash',
        icon: <DeleteOutlined />,
        onClick: () => handleTrashClick(article.id)
      },
    ]
}
