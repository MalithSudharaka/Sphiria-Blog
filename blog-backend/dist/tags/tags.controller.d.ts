import { TagsService } from './tags.service';
export declare class TagsController {
    private readonly tagService;
    constructor(tagService: TagsService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    suggestTags(query: string, res: any): Promise<any>;
    createTag(body: {
        name: string;
    }, res: any): Promise<any>;
    updateTag(id: string, body: {
        name: string;
    }, res: any): Promise<any>;
    deleteTag(id: string, res: any): Promise<any>;
}
