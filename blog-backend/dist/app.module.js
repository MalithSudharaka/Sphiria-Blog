"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./prisma/prisma.service");
const content_module_1 = require("./content/content.module");
const tags_service_1 = require("./tags/tags.service");
const tags_controller_1 = require("./tags/tags.controller");
const tags_module_1 = require("./tags/tags.module");
const categories_service_1 = require("./categories/categories.service");
const categories_controller_1 = require("./categories/categories.controller");
const categories_module_1 = require("./categories/categories.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [content_module_1.ContentModule, tags_module_1.TagsModule, categories_module_1.CategoriesModule],
        controllers: [app_controller_1.AppController, tags_controller_1.TagsController, categories_controller_1.CategoriesController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService, tags_service_1.TagsService, categories_service_1.CategoriesService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map