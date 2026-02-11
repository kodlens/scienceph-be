import { Article } from "@/types/article";
import { DeleteOutlined, EditOutlined, GlobalOutlined, StopOutlined } from "@ant-design/icons";
import { Eye } from "lucide-react";

export const adminMenuItems = (
  {
    handleEditClick,
    handleTrashClick,
    handleView,
    handlePublish,
    handleDraft,
    handleDelete,
    article
  }:
  {
    handleEditClick: () => void,
    handleTrashClick: () => void,
    handleView: () => void,
    handlePublish: () => void,
    handleDraft: () => void,
    handleDelete: () => void
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
    {
      label: 'Trash',
      key: 'admin.articles.trash',
      disabled: article.status === 'publish',
      icon: <DeleteOutlined />,
      onClick: () => handleTrashClick()
    },
    {
      label: 'Publish',
      key: 'admin.articles.publish',
      disabled: article.status === 'publish',
      icon: <GlobalOutlined />,
      onClick: () => handlePublish()
    },
    {
      label: 'Draft',
      disabled: article.status === 'unpublish',
      key: 'admin.articles.unpublish',
      icon: <StopOutlined />,
      onClick: () => handleDraft()
    },
    {
      label: 'View',
      key: 'admin.articles.view',
      icon: <Eye size={15} />,
      onClick: () => handleView()
    },
    {
      type: 'divider'
    },
    {
      label: 'Delete',
      key: 'admin.articles.delete',
      icon: <DeleteOutlined />,
      onClick: () => handleDelete()
    }

  ]
}
