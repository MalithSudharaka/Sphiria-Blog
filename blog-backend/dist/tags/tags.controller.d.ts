import { TagsService } from './tags.service';
export declare class TagsController {
    private readonly tagService;
    constructor(tagService: TagsService);
    suggestTags(query: string, res: any): Promise<any>;
    createTag(body: {
        name: string;
    }, res: any): Promise<any>;
}
