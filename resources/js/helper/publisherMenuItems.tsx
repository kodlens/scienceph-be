import { Article } from "@/types/article";
import { DeleteOutlined, EditOutlined, GlobalOutlined, StopOutlined } from "@ant-design/icons";
import { Eye } from "lucide-react";

export const publisherMenuItems = (
  {
    article,
    handleEditClick,
    handleTrashClick,
    handlePublish,
    handleDraft,
    handleView
  }:
  {
    handleEditClick: () => void,
    handleTrashClick: () => void,
    handlePublish: () => void,
    handleDraft: () => void,
    handleView: () => void,
    article: Article
  }
) => {
  return [
    {
      label: 'Edit',
      key: 'publisher.articles.edit',
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
      label: 'Publish',
      key: 'encoder.articles.publish',
      disabled: article.status === 'publish',
      icon: <GlobalOutlined  />,
      onClick: () => handlePublish()
    },
    {
      label: 'Draft',
      disabled: article.status === 'unpublish',
      key: 'encoder.articles.unpublish',
      icon: <StopOutlined />,
      onClick: () => handleDraft()
    },
    {
      label: 'View',
      key: 'encoder.articles.view',
      icon: <Eye size={15} />,
      onClick: () => handleView()
    },


  ]
}
