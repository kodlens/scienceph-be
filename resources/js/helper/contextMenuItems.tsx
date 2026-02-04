import { Article } from "@/types/article";
import { MenuProps } from "antd";

import { PageProps, User } from "@/types";
import { encoderMenuItems } from "./encoderMenuItems";
import { publisherMenuItems } from "./publisherMenuItems";
import { adminMenuItems } from "./adminMenuItems";

type Props = {
  article: Article;
  handleEditClick: (id: number) => void;
  handleTrashClick: (id: number) => void;
  auth: PageProps
}
export const contextMenuItems = ({ article, handleEditClick, handleTrashClick, auth }: Props) => {

    const items: MenuProps['items'] = [];

    const role = (auth.user as User) ? (auth.user as User).role.toLowerCase() : null;

    const encoderItems = encoderMenuItems({handleEditClick, handleTrashClick, article});

    const publisherItems = publisherMenuItems({handleEditClick, handleTrashClick, handlePublish, handleUnpublish, article});

    const adminItems = adminMenuItems({handleEditClick, article});


    items.push(
        ...(role === 'encoder' ? encoderItems : []),
        ...(role === 'publisher' ? publisherItems : []),
        ...(role === 'admin' ? adminItems : [])
    );

    return items;
  }
