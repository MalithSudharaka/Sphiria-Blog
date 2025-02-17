import { PrismaService } from '../prisma/prisma.service';
export declare class TagsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getSuggestedTags(query: string): Promise<{
        name: string;
    }[]>;
    createTag(name: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTag(id: string, name: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTag(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
