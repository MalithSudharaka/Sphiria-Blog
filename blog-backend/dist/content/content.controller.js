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
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const content_service_1 = require("./content.service");
let ContentController = class ContentController {
    constructor(contentService) {
        this.contentService = contentService;
    }
    async createContent(body, res) {
        if (!body.content || !body.title || !body.type) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                error: 'Content, title, and type are required',
            });
        }
        if (body.type === content_service_1.ContentType.EVENTS && (!body.location || !body.time)) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                error: 'Location and time are required for events',
            });
        }
        try {
            const savedContent = await this.contentService.saveContent(body.content, body.tags, body.categories, body.type, body.title, body.location || '', body.time || '', body.thumbnail || '', body.mode, body.seoTitle, body.metaDescription, body.metaKeywords);
            return res.status(common_1.HttpStatus.CREATED).json({
                message: 'Content saved successfully!',
                data: savedContent,
            });
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    }
    async getContents(mode, res) {
        try {
            const filter = mode ? { mode } : {};
            const contents = await this.contentService.getContents(filter);
            return res.status(common_1.HttpStatus.OK).json(contents);
        }
        catch (error) {
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: error.message,
            });
        }
    }
    async updateContent(id, body, res) {
        try {
            const updatedContent = await this.contentService.updateContent(id, body.content, body.tags, body.categories, body.type, body.title, body.location || '', body.time || '', body.thumbnail || '', body.mode, body.seoTitle, body.metaDescription, body.metaKeywords);
            return res.status(common_1.HttpStatus.OK).json({
                message: 'Content updated successfully',
                data: updatedContent,
            });
        }
        catch (error) {
            const status = error.message.includes('not found')
                ? common_1.HttpStatus.NOT_FOUND
                : common_1.HttpStatus.BAD_REQUEST;
            return res.status(status).json({
                error: error.message,
            });
        }
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "createContent", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('mode')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getContents", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "updateContent", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.Controller)('contents'),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentController);
//# sourceMappingURL=content.controller.js.map