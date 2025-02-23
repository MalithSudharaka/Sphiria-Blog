import { ContentService } from './content.service';
export declare enum ContentType {
    EVENTS = "EVENTS",
    BLOG = "BLOG",
    NEWS = "NEWS",
    CHARITY = "CHARITY",
    OTHER = "OTHER"
}
export declare enum ContentMode {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED"
}
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    saveContent(content: string, title: string, type: ContentType, tags: string[], categories: string[], location: string, time: string, thumbnail: string, mode: string, res: any): Promise<any>;
    getContents(mode: string, res: any): Promise<any>;
    updateContent(id: string, body: {
        content: string;
        title: string;
        type: ContentType;
        tags: string[];
        categories: string[];
        location: string;
        time: string;
        thumbnail: string;
        mode: ContentMode;
    }, res: any): Promise<any>;
}
