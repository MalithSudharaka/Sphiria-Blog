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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsController = void 0;
const common_1 = require("@nestjs/common");
const tags_service_1 = require("./tags.service");
let TagsController = class TagsController {
    constructor(tagService) {
        this.tagService = tagService;
    }
    async findAll() {
        return this.tagService.findAll();
    }
    async suggestTags(query, res) {
        const suggestedTags = await this.tagService.getSuggestedTags(query);
        return res.status(common_1.HttpStatus.OK).json(suggestedTags);
    }
    async createTag(body, res) {
        if (!body.name) {
            throw new common_1.BadRequestException('Tag name is required');
        }
        const tag = await this.tagService.createTag(body.name);
        return res.status(common_1.HttpStatus.CREATED).json({ message: 'Tag created', tag });
    }
    async updateTag(id, body, res) {
        if (!body.name) {
            throw new common_1.BadRequestException('Tag name is required');
        }
        const updatedTag = await this.tagService.updateTag(id, body.name);
        return res.status(common_1.HttpStatus.OK).json({ message: 'Tag updated', updatedTag });
    }
    async deleteTag(id, res) {
        await this.tagService.deleteTag(id);
        return res.status(common_1.HttpStatus.OK).json({ message: 'Tag deleted' });
    }
};
exports.TagsController = TagsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('suggest'),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "suggestTags", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "createTag", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "updateTag", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "deleteTag", null);
exports.TagsController = TagsController = __decorate([
    (0, common_1.Controller)('tags'),
    __metadata("design:paramtypes", [tags_service_1.TagsService])
], TagsController);
//# sourceMappingURL=tags.controller.js.map