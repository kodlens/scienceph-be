import { Article } from "@/types/article";
import { EditOutlined } from "@ant-design/icons";

export const publisherMenuItems = (
  {
    handleEditClick,
    article
  }:
    {
      handleEditClick: (id: number) => void,
      article: Article
    }
) => {
  return [
    {
      label: 'Edit',
      key: 'publisher.articles.edit',
      icon: <EditOutlined />,
      onClick: () => handleEditClick(article.id),
    },
  ]
}
