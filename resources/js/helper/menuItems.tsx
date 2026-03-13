import { Material } from "@/types/material";
import { DeleteOutlined, EditOutlined, GlobalOutlined, StopOutlined } from "@ant-design/icons";
import { Captions, Eye } from "lucide-react";

export const menuItems = (
  {
    handleEditClick,
    handleSubmitClick,
    handleTrashClick,
    handleView,
    handlePublish,
    handleDraft,
    handleDelete,
    material,
    prefix
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
    prefix: string
  }
) => {
  const items = []

  if(handleEditClick){
    items.push({
      label: 'Edit',
      key: `${prefix}.materials.edit`,
      disabled: material?.status === 'publish',
      icon: <EditOutlined />,
      onClick: () => handleEditClick(),
    })
  }

  if(handleSubmitClick){
    items.push({
      label: 'Submit',
      key: `${prefix}.materials.submit`,
      disabled: material?.status === 'publish',
      icon: <Captions size={15} />,
      onClick: () => handleSubmitClick(),
    })
  }

  if(handleTrashClick){
    items.push({
      label: 'Trash',
      key: `${prefix}.materials.trash`,
      disabled: material?.status === 'publish',
      icon: <DeleteOutlined />,
      onClick: () => handleTrashClick()
    })
  }

  if(handlePublish){
    items.push({
      label: 'Publish',
      key: `${prefix}.materials.publish`,
      disabled: material?.status === 'publish',
      icon: <GlobalOutlined />,
      onClick: () => handlePublish()
    })
  }

  if(handleDraft) {
    items.push({
      label: 'Draft',
      disabled: material?.status === 'draft',
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
      disabled: material?.status === 'publish',
      icon: <DeleteOutlined />,
      onClick: () => handleDelete()
    })
  }



  return items
}
