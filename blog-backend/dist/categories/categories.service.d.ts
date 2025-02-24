import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
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
    update(id: string, name: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addCategoriesToContent(contentId: string, categoryIds: string[]): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        type: import(".prisma/client").$Enums.ContentType | null;
        thumbnail: string | null;
        seoTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        location: string | null;
        time: Date | null;
        mode: string;
    }>;
    getCategoriesForContent(contentId: string): Promise<({
        categories: {
            id: string;
            contentId: string;
            categoryId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        type: import(".prisma/client").$Enums.ContentType | null;
        thumbnail: string | null;
        seoTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        location: string | null;
        time: Date | null;
        mode: string;
    }) | null>;
}
