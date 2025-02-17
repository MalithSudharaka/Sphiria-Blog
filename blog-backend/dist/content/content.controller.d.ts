import { ContentService } from './content.service';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    saveContent(content: string, tags: string[], res: any): Promise<any>;
    getContents(res: any): Promise<any>;
}
