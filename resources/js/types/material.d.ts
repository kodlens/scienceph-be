export interface Material {
    classification?: string;
    id: number;
    title?: string;
    description?: string;
    description_text?: string;
    author?: string;
    category_id?: number;
    category?: Category;

    slug?: string;
    source_url?: string;

    status?: string;
    tags?: string[];
    filter_type: string;
    resource_type: string;

    agency?: string;
    region?: string;

    encoded_by_id?: number;
    encoded_by?: User;
    encoded_at?: string | Date;

    modified_by_id?: number;
    modified_by?: User;
    modified_at?: string | Date;
    submitted_at?: string | Date;
    publisher_publish_date?: string | Date;

    is_publish?: string;
    publish_date?: string | Date;


    hits?: number;


    is_press_release?: number;
    is_archive?: number;
    record_trail?: string;
    trash?: string | number;
}
