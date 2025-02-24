import { MetaSettingsService } from './meta-settings.service';
import { CreateMetaSettingsDto } from './dto/create-meta-settings.dto';
export declare class MetaSettingsController {
    private readonly service;
    constructor(service: MetaSettingsService);
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
