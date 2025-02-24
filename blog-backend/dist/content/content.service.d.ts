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
    saveContent(content: string, tagNames: string[], categoryNames: string[], type: ContentType, title: string, location: string, time: string, thumbnail: string, mode: string, seoTitle: string, metaDescription: string, metaKeywords: string[]): Promise<{
        categories: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            contentId: string;
            categoryId: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
        tags: ({
            tag: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            contentId: string;
            tagId: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
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
        seoTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        tags: string[];
        categories: string[];
    }[]>;
    updateContent(id: string, content: string, tagNames: string[], categoryNames: string[], type: ContentType, title: string, location: string, time: string, thumbnail: string, mode: ContentMode, seoTitle: string, metaDescription: string, metaKeywords: string[]): Promise<{
        id: string;
        content: string;
        title: string | null;
        type: import(".prisma/client").$Enums.ContentType | null;
        thumbnail: string | null;
        location: string | null;
        mode: string;
        time: Date | null;
        seoTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string[];
        tags: string[];
        categories: string[];
    }>;
}
