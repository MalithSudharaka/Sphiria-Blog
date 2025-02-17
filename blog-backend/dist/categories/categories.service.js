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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.categories.findMany();
    }
    async findOne(id) {
        const category = await this.prisma.categories.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return category;
    }
    async create(name) {
        try {
            return await this.prisma.categories.create({
                data: { name },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Category creation failed');
        }
    }
    async update(id, name) {
        const existingCategory = await this.prisma.categories.findUnique({ where: { id } });
        if (!existingCategory)
            throw new common_1.NotFoundException('Category not found');
        return this.prisma.categories.update({
            where: { id },
            data: { name },
        });
    }
    async delete(id) {
        const category = await this.prisma.categories.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return this.prisma.categories.delete({
            where: { id },
        });
    }
    async addCategoriesToContent(contentId, categoryIds) {
        return this.prisma.content.update({
            where: { id: contentId },
            data: {
                categories: {
                    connect: categoryIds.map(id => ({ id })),
                },
            },
        });
    }
    async getCategoriesForContent(contentId) {
        return this.prisma.content.findUnique({
            where: { id: contentId },
            include: { categories: true },
        });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map