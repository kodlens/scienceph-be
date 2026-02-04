import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export const encoderMenuItems = (
  {
    handleEditClick,
    handleTrashClick
  }:
  {
    handleEditClick: () => void,
    handleTrashClick: () => void,
  }) => {

    return [
      {
        label: 'Edit',
        key: 'encoder.articles.edit',
        icon: <EditOutlined />,
        onClick: () => handleEditClick(),
      },
      {
        label: 'Trash',
        key: 'encoder.articles.trash',
        icon: <DeleteOutlined />,
        onClick: () => handleTrashClick()
      },
    ]
}
