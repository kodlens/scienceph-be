import { Article } from "@/types/article";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Eye } from "lucide-react";

export const encoderMenuItems = (
  {
    handleEditClick,
    handleTrashClick,
    handleView,
    article
  }:
  {
    handleEditClick: () => void,
    handleTrashClick: () => void,
    handleView: () => void,
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
      {
        label: 'View',
        key: 'encoder.articles.view',
        icon: <Eye size={15} />,
        onClick: () => handleView()
      },
    ]
}
