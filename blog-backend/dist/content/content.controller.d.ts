import { ContentService } from './content.service';
export declare enum ContentType {
    EVENTS = "EVENTS",
    BLOG = "BLOG",
    NEWS = "NEWS",
    CHARITY = "CHARITY",
    OTHER = "OTHER"
}
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    saveContent(content: string, title: string, type: ContentType, tags: string[], categories: string[], location: string, time: string, res: any): Promise<any>;
    getContents(res: any): Promise<any>;
}
