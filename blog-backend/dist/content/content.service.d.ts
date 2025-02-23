import { PrismaService } from './../prisma/prisma.service';
export declare enum ContentType {
    EVENTS = "EVENTS",
    BLOG = "BLOG",
    NEWS = "NEWS",
    CHARITY = "CHARITY",
    OTHER = "OTHER"
}
export declare enum ContentMode {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED"
}
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    saveContent(content: string, tagNames: string[], categoryNames: string[], type: ContentType, title: string, location: string, time: string, thumbnail: string, mode: string): Promise<{
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
        title: string | null;
        type: import(".prisma/client").$Enums.ContentType | null;
        thumbnail: string | null;
        location: string | null;
        time: Date | null;
        mode: string;
    }>;
    getContents(filter?: {
        mode?: string;
    }): Promise<{
        id: string;
        content: string;
        title: string | null;
        type: import(".prisma/client").$Enums.ContentType | null;
        thumbnail: string | null;
        location: string | null;
        mode: string;
        time: Date | null;
        tags: string[];
        categories: string[];
    }[]>;
    updateContent(id: string, content: string, tagNames: string[], categoryNames: string[], type: ContentType, title: string, location: string, time: string, thumbnail: string, mode: ContentMode): Promise<{
        id: string;
        content: string;
        title: string | null;
        type: import(".prisma/client").$Enums.ContentType | null;
        thumbnail: string | null;
        location: string | null;
        mode: string;
        time: Date | null;
        tags: string[];
        categories: string[];
    }>;
}
