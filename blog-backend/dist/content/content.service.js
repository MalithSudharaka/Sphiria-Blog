"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./../prisma/prisma.service");
let ContentService = class ContentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveContent(content, tagNames) {
        const tags = await Promise.all(tagNames.map(async (name) => this.prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
        })));
        return this.prisma.content.create({
            data: {
                content,
                tags: {
                    create: tags.map(tag => ({
                        tag: { connect: { id: tag.id } },
                    })),
                },
            },
            include: { tags: { include: { tag: true } } },
        });
    }
    async getContents() {
        const contents = await this.prisma.content.findMany({
            include: {
                tags: { include: { tag: true } },
            },
        });
        return contents.map((content) => ({
            id: content.id,
            content: content.content,
            tags: content.tags.map(tagRelation => tagRelation.tag.name),
        }));
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentService);
//# sourceMappingURL=content.service.js.map