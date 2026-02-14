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
    article,
    prefix
  }:
  {
    handleEditClick?: () => void,
    handleTrashClick?: () => void,
    handleView?: () => void,
    handlePublish?: () => void,
    handleDraft?: () => void,
    handleDelete?: () => void
    article?: Article,
    prefix: string
  }
) => {
  const items = []

  if(handleEditClick){
    items.push({
      label: 'Edit',
      key: `${prefix}.articles.edit`,
      disabled: article?.status === 'publish',
      icon: <EditOutlined />,
      onClick: () => handleEditClick(),
    })
  }

  if(handleTrashClick){
    items.push({
      label: 'Trash',
      key: `${prefix}.articles.trash`,
      disabled: article?.status === 'publish',
      icon: <DeleteOutlined />,
      onClick: () => handleTrashClick()
    })
  }

  if(handlePublish){
    items.push({
      label: 'Publish',
      key: `${prefix}.articles.publish`,
      disabled: article?.status === 'publish',
      icon: <GlobalOutlined />,
      onClick: () => handlePublish()
    })
  }

  if(handleDraft) {
    items.push({
      label: 'Draft',
      disabled: article?.status === 'draft',
      key: `${prefix}.articles.draft`,
      icon: <StopOutlined />,
      onClick: () => handleDraft()
    })
  }

  if(handleView){
    items.push({
      label: 'View',
      key: `${prefix}.articles.view`,
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
      key: `${prefix}.articles.delete`,
      disabled: article?.status === 'publish',
      icon: <DeleteOutlined />,
      onClick: () => handleDelete()
    })
  }



  return items
}
