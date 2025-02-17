import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class CategoriesService {
    private readonly prisma;
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
    addCategoriesToContent(contentId: string, categoryIds: string[]): Promise<Prisma.BatchPayload>;
    getCategoriesForContent(contentId: string): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contentId: string;
        categoryId: string;
    })[]>;
}
