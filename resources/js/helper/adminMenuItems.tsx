import { User } from "@/types";
import { Material } from "@/types/material";
import { DeleteOutlined, EditOutlined, GlobalOutlined, StopOutlined } from "@ant-design/icons";
import { Captions, Eye } from "lucide-react";

export const adminMenuItems = (
  {
    handleEditClick,
    handleSubmitClick,
    handleTrashClick,
    handleView,
    handlePublish,
    handleDraft,
    handleDelete,
    prefix,
  }:
  {
    handleEditClick?: () => void,
    handleSubmitClick?:() => void,
    handleTrashClick?: () => void,
    handleView?: () => void,
    handlePublish?: () => void,
    handleDraft?: () => void,
    handleDelete?: () => void
    material?: Material,
    prefix: string,
    user: User
  }
) => {
  const items = []

  //this will handle the disable enable per user role


  if(handleEditClick){
    items.push({
      label: 'Edit',
      key: `${prefix}.materials.edit`,
      icon: <EditOutlined />,
      onClick: () => handleEditClick(),
    })
  }

  if(handleSubmitClick){
    items.push({
      label: 'Submit',
      key: `${prefix}.materials.submit`,
      icon: <Captions size={15} />,
      onClick: () => handleSubmitClick(),
    })
  }

  if(handleTrashClick){
    items.push({
      label: 'Trash',
      key: `${prefix}.materials.trash`,
      icon: <DeleteOutlined />,
      onClick: () => handleTrashClick()
    })
  }

  if(handlePublish){
    items.push({
      label: 'Publish',
      key: `${prefix}.materials.publish`,
      icon: <GlobalOutlined />,
      onClick: () => handlePublish()
    })
  }

  if(handleDraft) {
    items.push({
      label: 'Draft',
      key: `${prefix}.materials.draft`,
      icon: <StopOutlined />,
      onClick: () => handleDraft()
    })
  }

  if(handleView){
    items.push({
      label: 'View',
      key: `${prefix}.materials.view`,
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
      key: `${prefix}.materials.delete`,
      icon: <DeleteOutlined />,
      onClick: () => handleDelete()
    })
  }

  return items
}
