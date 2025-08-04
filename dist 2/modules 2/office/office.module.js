"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfficeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const office_service_1 = require("./office.service");
const office_controller_1 = require("./office.controller");
const entities_1 = require("../../entities");
let OfficeModule = class OfficeModule {
};
exports.OfficeModule = OfficeModule;
exports.OfficeModule = OfficeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.Office])],
        controllers: [office_controller_1.OfficeController],
        providers: [office_service_1.OfficeService],
        exports: [office_service_1.OfficeService],
    })
], OfficeModule);
//# sourceMappingURL=office.module.js.map