export interface Material {
    data(data: any): unknown;
    id: number;
    source_id?: number;
    title?: string;
    description?: string;
    description_text?: string;

    section_id: number;
    section?: Section;
    category_id?: number;
    category?: Category;

    alias?: string;
    source_url?: string;

    status?: string;
    tags?: string[];
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

    author?: string;
    hits?: number;


    is_press_release?: number;
    is_archive?: number;
    record_trail?: string;
    trash?: string | number;
}
