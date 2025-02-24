import { ContentService, ContentType, ContentMode } from './content.service';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    createContent(body: {
        content: string;
        title: string;
        type: ContentType;
        tags: string[];
        categories: string[];
        location?: string;
        time?: string;
        thumbnail?: string;
        mode: string;
        seoTitle: string;
        metaDescription: string;
        metaKeywords: string[];
    }, res: any): Promise<any>;
    getContents(mode: string, res: any): Promise<any>;
    updateContent(id: string, body: {
        content: string;
        title: string;
        type: ContentType;
        tags: string[];
        categories: string[];
        location?: string;
        time?: string;
        thumbnail?: string;
        mode: ContentMode;
        seoTitle: string;
        metaDescription: string;
        metaKeywords: string[];
    }, res: any): Promise<any>;
}
