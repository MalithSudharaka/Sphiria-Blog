import { PrismaService } from './../prisma/prisma.service';
export declare enum ContentType {
    EVENTS = "EVENTS",
    BLOG = "BLOG",
    NEWS = "NEWS",
    CHARITY = "CHARITY",
    OTHER = "OTHER"
}
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    saveContent(content: string, tagNames: string[], categoryNames: string[], type: ContentType, title: string, location: string, time: string): Promise<{
        categories: ({
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
        title: string | null;
        type: import(".prisma/client").$Enums.ContentType | null;
        location: string | null;
        time: Date | null;
    }>;
    getContents(): Promise<{
        id: string;
        content: string;
        title: string | null;
        type: import(".prisma/client").$Enums.ContentType | null;
        location: string | null;
        time: Date | null;
        tags: string[];
        categories: string[];
    }[]>;
}
