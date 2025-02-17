import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(name: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
