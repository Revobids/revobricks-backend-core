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
exports.PublicProjectController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const project_service_1 = require("./project.service");
const get_projects_dto_1 = require("./dto/get-projects.dto");
const user_jwt_auth_guard_1 = require("../../guards/user-jwt-auth.guard");
const get_user_decorator_1 = require("../../decorators/get-user.decorator");
const user_entity_1 = require("../../entities/user.entity");
let PublicProjectController = class PublicProjectController {
    projectService;
    constructor(projectService) {
        this.projectService = projectService;
    }
    async getProjects(query) {
        return this.projectService.getPublishedProjectsWithFilters(query);
    }
    async getProject(id) {
        return this.projectService.getPublishedProjectById(id);
    }
    async getProjectWithBookmark(id, user) {
        return this.projectService.getPublishedProjectWithBookmark(id, user.id);
    }
};
exports.PublicProjectController = PublicProjectController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all published projects with optional filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of published projects' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, description: 'Filter by city' }),
    (0, swagger_1.ApiQuery)({ name: 'state', required: false, description: 'Filter by state' }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'projectType', required: false, enum: ['RESIDENTIAL', 'COMMERCIAL', 'MIXED_USE'] }),
    (0, swagger_1.ApiQuery)({ name: 'propertyType', required: false, enum: ['APARTMENT', 'VILLA', 'PLOT', 'OFFICE', 'SHOP', 'WAREHOUSE'] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_projects_dto_1.GetProjectsDto]),
    __metadata("design:returntype", Promise)
], PublicProjectController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a published project by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found or not published' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicProjectController.prototype, "getProject", null);
__decorate([
    (0, common_1.Get)(':id/with-bookmark'),
    (0, common_1.UseGuards)(user_jwt_auth_guard_1.UserJwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a published project with bookmark status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project details with bookmark status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found or not published' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PublicProjectController.prototype, "getProjectWithBookmark", null);
exports.PublicProjectController = PublicProjectController = __decorate([
    (0, swagger_1.ApiTags)('public/projects'),
    (0, common_1.Controller)('public/projects'),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], PublicProjectController);
//# sourceMappingURL=public-project.controller.js.map