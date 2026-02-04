import { DeleteOutlined, EditOutlined, GlobalOutlined, StopOutlined } from "@ant-design/icons";

export const publisherMenuItems = (
  {
    handleEditClick,
    handleTrashClick,
    handlePublish,
    handleUnpublish
  }:
  {
    handleEditClick: () => void,
    handleTrashClick: () => void,
    handlePublish: () => void,
    handleUnpublish: () => void,
  }
) => {
  return [
    {
      label: 'Edit',
      key: 'publisher.articles.edit',
      icon: <EditOutlined />,
      onClick: () => handleEditClick(),
    },
    {
      label: 'Trash',
      key: 'encoder.articles.trash',
      icon: <DeleteOutlined />,
      onClick: () => handleTrashClick()
    },
    {
      label: 'Publish',
      key: 'encoder.articles.publish',
      icon: <GlobalOutlined  />,
      onClick: () => handlePublish()
    },
    {
      label: 'Unpublish',
      key: 'encoder.articles.unpublish',
      icon: <StopOutlined />,
      onClick: () => handleUnpublish()
    },


  ]
}
