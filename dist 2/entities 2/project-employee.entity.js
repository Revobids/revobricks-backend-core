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
exports.ProjectEmployee = exports.ProjectRole = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./project.entity");
const real_estate_developer_employee_entity_1 = require("./real-estate-developer-employee.entity");
var ProjectRole;
(function (ProjectRole) {
    ProjectRole["PROJECT_MANAGER"] = "PROJECT_MANAGER";
    ProjectRole["SALES_MANAGER"] = "SALES_MANAGER";
    ProjectRole["SALES_EXECUTIVE"] = "SALES_EXECUTIVE";
    ProjectRole["SITE_ENGINEER"] = "SITE_ENGINEER";
    ProjectRole["ARCHITECT"] = "ARCHITECT";
    ProjectRole["LEGAL_ADVISOR"] = "LEGAL_ADVISOR";
    ProjectRole["MARKETING"] = "MARKETING";
    ProjectRole["OTHER"] = "OTHER";
})(ProjectRole || (exports.ProjectRole = ProjectRole = {}));
let ProjectEmployee = class ProjectEmployee {
    id;
    projectId;
    project;
    employeeId;
    employee;
    role;
    assignedDate;
    isActive;
    createdAt;
};
exports.ProjectEmployee = ProjectEmployee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProjectEmployee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ProjectEmployee.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.projectEmployees, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'projectId' }),
    __metadata("design:type", project_entity_1.Project)
], ProjectEmployee.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ProjectEmployee.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => real_estate_developer_employee_entity_1.RealEstateDeveloperEmployee, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'employeeId' }),
    __metadata("design:type", real_estate_developer_employee_entity_1.RealEstateDeveloperEmployee)
], ProjectEmployee.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProjectRole,
    }),
    __metadata("design:type", String)
], ProjectEmployee.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], ProjectEmployee.prototype, "assignedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ProjectEmployee.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProjectEmployee.prototype, "createdAt", void 0);
exports.ProjectEmployee = ProjectEmployee = __decorate([
    (0, typeorm_1.Entity)('project_employees'),
    (0, typeorm_1.Unique)(['projectId', 'employeeId'])
], ProjectEmployee);
//# sourceMappingURL=project-employee.entity.js.map