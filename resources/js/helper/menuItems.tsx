import { Article } from "@/types/article";
import { DeleteOutlined, EditOutlined, GlobalOutlined, StopOutlined } from "@ant-design/icons";
import { Eye } from "lucide-react";

export const menuItems = (
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
    handleEditClick?: () => void,
    handleTrashClick?: () => void,
    handleView?: () => void,
    handlePublish?: () => void,
    handleDraft?: () => void,
    handleDelete?: () => void
    article?: Article
  }
) => {
  const items = []

  if(handleEditClick){
    items.push({
      label: 'Edit',
      key: 'admin.articles.edit',
      disabled: article?.status === 'publish',
      icon: <EditOutlined />,
      onClick: () => handleEditClick(),
    })
  }

  if(handleTrashClick){
    items.push({
      label: 'Trash',
      key: 'admin.articles.trash',
      disabled: article?.status === 'publish',
      icon: <DeleteOutlined />,
      onClick: () => handleTrashClick()
    })
  }

  if(handlePublish){
    items.push({
      label: 'Publish',
      key: 'admin.articles.publish',
      disabled: article?.status === 'publish',
      icon: <GlobalOutlined />,
      onClick: () => handlePublish()
    })
  }

  if(handleDraft) {
    items.push({
      label: 'Draft',
      disabled: article?.status === 'draft',
      key: 'admin.articles.draft',
      icon: <StopOutlined />,
      onClick: () => handleDraft()
    })
  }

  if(handleView){
    items.push({
      label: 'View',
      key: 'admin.articles.view',
      icon: <Eye size={15} />,
      onClick: () => handleView()
    })
  }


  if(handleDelete){
    items.push(
      {
        type: 'divider'
      },
      {
      label: 'Delete',
      key: 'admin.articles.delete',
      disabled: article?.status === 'publish',
      icon: <DeleteOutlined />,
      onClick: () => handleDelete()
    })
  }



  return items
}
