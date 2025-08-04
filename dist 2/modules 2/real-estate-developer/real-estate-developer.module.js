"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealEstateDeveloperModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const real_estate_developer_service_1 = require("./real-estate-developer.service");
const real_estate_developer_controller_1 = require("./real-estate-developer.controller");
const entities_1 = require("../../entities");
let RealEstateDeveloperModule = class RealEstateDeveloperModule {
};
exports.RealEstateDeveloperModule = RealEstateDeveloperModule;
exports.RealEstateDeveloperModule = RealEstateDeveloperModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.RealEstateDeveloper,
                entities_1.RealEstateDeveloperEmployee,
                entities_1.Office,
            ]),
        ],
        controllers: [real_estate_developer_controller_1.RealEstateDeveloperController],
        providers: [real_estate_developer_service_1.RealEstateDeveloperService],
        exports: [real_estate_developer_service_1.RealEstateDeveloperService],
    })
], RealEstateDeveloperModule);
//# sourceMappingURL=real-estate-developer.module.js.map