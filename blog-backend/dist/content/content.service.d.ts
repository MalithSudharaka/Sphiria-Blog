import { PrismaService } from './../prisma/prisma.service';
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    saveContent(content: string, tagNames: string[]): Promise<{
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
    }>;
    getContents(): Promise<{
        id: string;
        content: string;
        tags: string[];
    }[]>;
}
