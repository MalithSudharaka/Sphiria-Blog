import { PrismaService } from './../prisma/prisma.service';
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    saveContent(content: string, tagNames: string[], categoryNames: string[]): Promise<{
        categories: ({
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            contentId: string;
        })[];
        tags: ({
            tag: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tagId: string;
            contentId: string;
        })[];
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getContents(): Promise<{
        id: string;
        content: string;
        tags: string[];
        categories: string[];
    }[]>;
}
