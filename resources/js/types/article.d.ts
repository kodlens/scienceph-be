export interface Article {
    data(data: any): unknown;
    id: number;
    source_id?: number;
    title?: string;
    description?: string;
    description_text?: string;
    alias?: string;
    source_url?: string;
    agency?: string;
    status?: string;
    tags?: string[];
    content_type: string;

    region?: string;
    agency?: string;

    is_publish?: string;
    publish_date?: string | Date;

    author?: string;
    hits?: number;


    is_press_release?: number;
    is_archive?: number;
    record_trail?: string;
    trash?: string | number;
}


export interface InfoSubjectHeading  {
    id: number;
    info_id: number;
    subject_id: number;
    subject_heading_id: number;
    score?: number;
    analysis?: string;
    subject?: string;
    subject_heading?: string;
}

