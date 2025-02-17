import { PrismaService } from '../prisma/prisma.service';
export declare class TagsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSuggestedTags(query: string): Promise<{
        name: string;
    }[]>;
    createTag(name: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
