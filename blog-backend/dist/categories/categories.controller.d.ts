import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(name: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, name: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addCategoriesToContent(contentId: string, categoryIds: string[]): Promise<{
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        type: import(".prisma/client").$Enums.ContentType | null;
        location: string | null;
        time: Date | null;
    }>;
    getCategoriesForContent(contentId: string): Promise<({
        categories: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            contentId: string;
        }[];
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        type: import(".prisma/client").$Enums.ContentType | null;
        location: string | null;
        time: Date | null;
    }) | null>;
}
