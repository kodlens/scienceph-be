import { User } from "@/types";
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
    prefix,
    user
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
  const disableEdit = (status?:string) => {
    if(user.role.toLowerCase() === 'encoder'){
      return status === 'submit'
    }

    if(user.role.toLowerCase() === 'publisher'){
      return status === 'publish'
    }
  }

  if(handleEditClick){
    items.push({
      label: 'Edit',
      key: `${prefix}.materials.edit`,
      disabled: disableEdit(material?.status),
      icon: <EditOutlined />,
      onClick: () => handleEditClick(),
    })
  }

  if(handleSubmitClick){
    items.push({
      label: 'Submit',
      key: `${prefix}.materials.submit`,
      disabled: material?.status === 'submit' || material?.status === 'publish',
      icon: <Captions size={15} />,
      onClick: () => handleSubmitClick(),
    })
  }

  if(handleTrashClick){
    items.push({
      label: 'Trash',
      key: `${prefix}.materials.trash`,
      disabled: material?.status === 'publish' || material?.status === 'submit',
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
      disabled: enableMenuDraft(user, material!),
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


  if(handleDelete && material?.status === 'draft'){
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


function enableMenuDraft(user:User, material:Material){
  if(user.role.toLowerCase() === 'encoder'){
    return material?.status === 'draft' || material?.status === 'publish';
  }

  if(user.role.toLowerCase() === 'publisher'){
    return material?.status === 'draft';
  }

  return true;
}
