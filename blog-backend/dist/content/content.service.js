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
exports.ContentService = exports.ContentMode = exports.ContentType = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./../prisma/prisma.service");
var ContentType;
(function (ContentType) {
    ContentType["EVENTS"] = "EVENTS";
    ContentType["BLOG"] = "BLOG";
    ContentType["NEWS"] = "NEWS";
    ContentType["CHARITY"] = "CHARITY";
    ContentType["OTHER"] = "OTHER";
})(ContentType || (exports.ContentType = ContentType = {}));
var ContentMode;
(function (ContentMode) {
    ContentMode["DRAFT"] = "DRAFT";
    ContentMode["PUBLISHED"] = "PUBLISHED";
})(ContentMode || (exports.ContentMode = ContentMode = {}));
let ContentService = class ContentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveContent(content, tagNames, categoryNames, type, title, location, time, thumbnail, mode) {
        const tags = await Promise.all(tagNames.map(async (name) => this.prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
        })));
        const categories = await Promise.all(categoryNames.map(async (name) => this.prisma.categories.upsert({
            where: { name },
            update: {},
            create: { name },
        })));
        let validTime = null;
        if (time && !isNaN(new Date(time).getTime())) {
            validTime = new Date(time);
        }
        else if (type === ContentType.EVENTS) {
            throw new Error('Invalid event time');
        }
        return this.prisma.content.create({
            data: {
                content,
                type,
                title,
                location,
                time: validTime,
                thumbnail,
                mode,
                tags: {
                    create: tags.map((tag) => ({
                        tag: { connect: { id: tag.id } },
                    })),
                },
                categories: {
                    create: categories.map((category) => ({
                        category: { connect: { id: category.id } },
                    })),
                },
            },
            include: {
                tags: { include: { tag: true } },
                categories: { include: { category: true } },
            },
        });
    }
    async getContents(filter) {
        const contents = await this.prisma.content.findMany({
            where: filter,
            include: {
                tags: { include: { tag: true } },
                categories: { include: { category: true } },
            },
        });
        return contents.map((content) => ({
            id: content.id,
            content: content.content,
            title: content.title,
            type: content.type,
            thumbnail: content.thumbnail,
            location: content.location,
            mode: content.mode,
            time: content.time,
            tags: content.tags.map((tagRelation) => tagRelation.tag.name),
            categories: content.categories.map((categoryRelation) => categoryRelation.category.name),
        }));
    }
    async updateContent(id, content, tagNames, categoryNames, type, title, location, time, thumbnail, mode) {
        if (!content || !title || !type) {
            throw new Error('Content, title, and type are required');
        }
        if (type === ContentType.EVENTS && (!location || !time)) {
            throw new Error('Location and time are required for events');
        }
        if (!Object.values(ContentMode).includes(mode)) {
            throw new Error('Invalid content mode');
        }
        return this.prisma.$transaction(async (prisma) => {
            const tags = await Promise.all(tagNames.map((name) => prisma.tag.upsert({
                where: { name },
                update: {},
                create: { name },
            })));
            const categories = await Promise.all(categoryNames.map((name) => prisma.categories.upsert({
                where: { name },
                update: {},
                create: { name },
            })));
            const validTime = time ? new Date(time) : null;
            if (type === ContentType.EVENTS &&
                (!validTime || isNaN(validTime.getTime()))) {
                throw new Error('Valid time is required for events');
            }
            const updatedContent = await prisma.content.update({
                where: { id },
                data: {
                    content,
                    title,
                    type,
                    location,
                    time: validTime,
                    thumbnail,
                    mode,
                    tags: {
                        deleteMany: {},
                        create: tags.map((tag) => ({
                            tag: { connect: { id: tag.id } },
                        })),
                    },
                    categories: {
                        deleteMany: {},
                        create: categories.map((category) => ({
                            category: { connect: { id: category.id } },
                        })),
                    },
                },
                include: {
                    tags: { include: { tag: true } },
                    categories: { include: { category: true } },
                },
            });
            return {
                id: updatedContent.id,
                content: updatedContent.content,
                title: updatedContent.title,
                type: updatedContent.type,
                thumbnail: updatedContent.thumbnail,
                location: updatedContent.location,
                mode: updatedContent.mode,
                time: updatedContent.time,
                tags: updatedContent.tags.map((tr) => tr.tag.name),
                categories: updatedContent.categories.map((cr) => cr.category.name),
            };
        });
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentService);
//# sourceMappingURL=content.service.js.map