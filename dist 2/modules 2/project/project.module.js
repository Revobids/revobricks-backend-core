"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const project_service_1 = require("./project.service");
const project_controller_1 = require("./project.controller");
const public_project_controller_1 = require("./public-project.controller");
const project_entity_1 = require("../../entities/project.entity");
const project_employee_entity_1 = require("../../entities/project-employee.entity");
const real_estate_developer_employee_entity_1 = require("../../entities/real-estate-developer-employee.entity");
const bookmark_entity_1 = require("../../entities/bookmark.entity");
const s3_service_1 = require("../../services/s3.service");
let ProjectModule = class ProjectModule {
};
exports.ProjectModule = ProjectModule;
exports.ProjectModule = ProjectModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                project_entity_1.Project,
                project_employee_entity_1.ProjectEmployee,
                real_estate_developer_employee_entity_1.RealEstateDeveloperEmployee,
                bookmark_entity_1.Bookmark,
            ]),
        ],
        controllers: [project_controller_1.ProjectController, public_project_controller_1.PublicProjectController],
        providers: [project_service_1.ProjectService, s3_service_1.S3Service],
        exports: [project_service_1.ProjectService],
    })
], ProjectModule);
//# sourceMappingURL=project.module.js.map