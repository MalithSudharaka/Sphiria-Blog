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
exports.ContentController = exports.ContentType = void 0;
const common_1 = require("@nestjs/common");
const content_service_1 = require("./content.service");
var ContentType;
(function (ContentType) {
    ContentType["EVENTS"] = "EVENTS";
    ContentType["BLOG"] = "BLOG";
    ContentType["NEWS"] = "NEWS";
    ContentType["CHARITY"] = "CHARITY";
    ContentType["OTHER"] = "OTHER";
})(ContentType || (exports.ContentType = ContentType = {}));
let ContentController = class ContentController {
    constructor(contentService) {
        this.contentService = contentService;
    }
    async saveContent(content, title, type, tags, categories, location, time, thumbnail, res) {
        if (!content || !title || !type) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                error: 'Content, title, and type are required',
            });
        }
        if (type === ContentType.EVENTS && (!location || !time)) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                error: 'Location and time are required for events',
            });
        }
        const savedContent = await this.contentService.saveContent(content, tags, categories, type, title, location, time, thumbnail);
        return res.status(common_1.HttpStatus.CREATED).json({
            message: 'Content saved successfully!',
            data: savedContent,
        });
    }
    async getContents(res) {
        const contents = await this.contentService.getContents();
        return res.status(common_1.HttpStatus.OK).json(contents);
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('content')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('type')),
    __param(3, (0, common_1.Body)('tags')),
    __param(4, (0, common_1.Body)('categories')),
    __param(5, (0, common_1.Body)('location')),
    __param(6, (0, common_1.Body)('time')),
    __param(7, (0, common_1.Body)('thumbnail')),
    __param(8, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Array, Array, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "saveContent", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getContents", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.Controller)('contents'),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentController);
//# sourceMappingURL=content.controller.js.map