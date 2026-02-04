export interface User {
	  data(data: any): unknown;
    id: number;
    username: string,
    sex: string,
    name: string;
    lname: string;
    fname: string;
    mname: string;
    email: string;
    email_verified_at: string;
    active: boolean;
	  role: string;
}

export interface Encoder extends User {
    data(data: any): unknown;
    id: number;
    author: string;
    role: string;
    is_active: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        csrf_token: string;
    };
};




export interface PostLog {
    id: number;
    user_id: number;
    post_id: number;
    alias: string;
    description: string;
    action: string;
    created_at: Date;
    updated_at: Date;
}

export interface Permission {
    id: number;
    module_name: string;
    name: string;
    label: string;
    description: string;
}

export interface CategoryArticles {
    category_id: number;
    category: string;
    active: number;
    articles: Post[]
}



export interface CreateEditProps {
  id: number,
  auth: PageProps,
  article: Article,
  ckLicense: string,
  sections: Section[],
  categories: Category[],
  authors: AuthorApi,
  agencies: Agency[],
  regions: Region[],
  tags: string[],
  uri: string
}

export interface Template {
	data(data: any): unknown;
    id: number;
    template:string;
    created_at:Date;
    updated_at:Date;
}

export interface Author {
  id?: number;
  author?:string;
  value?:string;
}



export interface Page {
	data(data: any): unknown;
    id: number;
    title: string;
    description: string;
    slug: string;
    created_at:Date;
    updated_at:Date;
}

export interface Layout extends Section, Template, Page{
	data(data: any): unknown;
    id: number;
    page_id:number;
    section_id:number;
    template_id:string;
    created_at:Date;
    updated_at:Date;
}


export interface Layout {
	data(data: any): unknown;
    id: number;
    name:string;
    description:string;
    img:string;
    active:number;
    created_at:Date;
    updated_at:Date;
}


export interface Banner {
    id:number;
    active:number;
    data(data: any): unknown;
    name: string;
    description: string;
    img: string;
}

export interface PaginateResponse {
    data: any[];
    total: number;

}

export interface FeaturedVideo {
    id: number;
    data(data: any): unknown;
    total: number;
    link: string;
    description: string;
    order_no: number;
    title: string;
    excerpt: string;
    is_featured: number;
}


export interface Dostv {
    id: number;
    data(data: any): unknown;
    title: string;
    slug:string;
    description: string;
    featured_image:string;
    website:string;
    link: string;
    active: number;
    created_at:Date;
    updated_at:Date;
}
