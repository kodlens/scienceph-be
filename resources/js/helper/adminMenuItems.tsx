import { Article } from "@/types/article";
import { EditOutlined } from "@ant-design/icons";

export const adminMenuItems = (
  {
    handleEditClick,
    handleTrashClick,
    handleView,
    handlePublish,
    handleDraft,
    article
  }:
  {
    handleEditClick: () => void,
    handleTrashClick: () => void,
    handleView: () => void,
    handlePublish: () => void,
    handleDraft: () => void,
    article: Article
  }
) => {
    return [
        {
            label: 'Edit',
            key: 'admin.articles.edit',
            icon: <EditOutlined />,
            onClick: () => handleEditClick(),
        },
    ]
}
