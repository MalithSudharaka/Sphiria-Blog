import { PrismaService } from '../prisma/prisma.service';
import { CreateMetaSettingsDto } from './dto/create-meta-settings.dto';
export declare class MetaSettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        title: string;
        metaKeyword: string;
        metaDescription: string;
        googleAnalyticsId: string;
        defaultImage: string | null;
    } | null>;
    updateSettings(data: CreateMetaSettingsDto): Promise<{
        id: string;
        title: string;
        metaKeyword: string;
        metaDescription: string;
        googleAnalyticsId: string;
        defaultImage: string | null;
    }>;
}
