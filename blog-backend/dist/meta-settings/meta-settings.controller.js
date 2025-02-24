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
exports.MetaSettingsController = void 0;
const common_1 = require("@nestjs/common");
const meta_settings_service_1 = require("./meta-settings.service");
const create_meta_settings_dto_1 = require("./dto/create-meta-settings.dto");
let MetaSettingsController = class MetaSettingsController {
    constructor(service) {
        this.service = service;
    }
    getSettings() {
        return this.service.getSettings();
    }
    updateSettings(data) {
        return this.service.updateSettings(data);
    }
};
exports.MetaSettingsController = MetaSettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetaSettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_meta_settings_dto_1.CreateMetaSettingsDto]),
    __metadata("design:returntype", void 0)
], MetaSettingsController.prototype, "updateSettings", null);
exports.MetaSettingsController = MetaSettingsController = __decorate([
    (0, common_1.Controller)('meta-settings'),
    __metadata("design:paramtypes", [meta_settings_service_1.MetaSettingsService])
], MetaSettingsController);
//# sourceMappingURL=meta-settings.controller.js.map