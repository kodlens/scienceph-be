import { Article } from "@/types/article";
import { DeleteOutlined, EditOutlined, GlobalOutlined, StopOutlined } from "@ant-design/icons";
import { Eye } from "lucide-react";

export const publisherTrashMenuItem = (
  {
    article,
    handleDraft,
    handleView
  }:
  {

    handleDraft: () => void,
    handleView: () => void,
    article: Article
  }
) => {
  return [
    {
      label: 'Draft',
      key: 'publisher.trash-articles.draft',
      disabled: article.status === 'trash',
      icon: <EditOutlined />,
      onClick: () => handleDraft(),
    },
    {
      label: 'View',
      key: 'publisher.articles.view',
      icon: <Eye size={15} />,
      onClick: () => handleView()
    },


  ]
}
