import { Article } from "@/types/article";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export const encoderMenuItems = (
  {
    handleEditClick,
    handleTrashClick,
    article
  }:
  {
    handleEditClick: () => void,
    handleTrashClick: () => void,
    article: Article
  }) => {

    return [
      {
        label: 'Edit',
        key: 'encoder.articles.edit',
        disabled: article.status === 'publish',
        icon: <EditOutlined />,
        onClick: () => handleEditClick(),
      },
      {
        label: 'Trash',
        key: 'encoder.articles.trash',
        disabled: article.status === 'publish',
        icon: <DeleteOutlined />,
        onClick: () => handleTrashClick()
      },
    ]
}
