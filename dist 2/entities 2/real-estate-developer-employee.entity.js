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
exports.RealEstateDeveloperEmployee = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const real_estate_developer_entity_1 = require("./real-estate-developer.entity");
const office_entity_1 = require("./office.entity");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["SALES_MANAGER"] = "sales_manager";
    UserRole["SALES_EXECUTIVE"] = "sales_executive";
    UserRole["SALES"] = "sales";
    UserRole["FINANCE"] = "finance";
})(UserRole || (exports.UserRole = UserRole = {}));
let RealEstateDeveloperEmployee = class RealEstateDeveloperEmployee {
    id;
    username;
    password;
    name;
    email;
    employeeId;
    role;
    isActive;
    firebaseUid;
    createdAt;
    updatedAt;
    realEstateDeveloper;
    realEstateDeveloperId;
    office;
    officeId;
};
exports.RealEstateDeveloperEmployee = RealEstateDeveloperEmployee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RealEstateDeveloperEmployee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], RealEstateDeveloperEmployee.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RealEstateDeveloperEmployee.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RealEstateDeveloperEmployee.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], RealEstateDeveloperEmployee.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RealEstateDeveloperEmployee.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserRole,
        default: UserRole.SALES,
    }),
    __metadata("design:type", String)
], RealEstateDeveloperEmployee.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], RealEstateDeveloperEmployee.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RealEstateDeveloperEmployee.prototype, "firebaseUid", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RealEstateDeveloperEmployee.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RealEstateDeveloperEmployee.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => real_estate_developer_entity_1.RealEstateDeveloper, (developer) => developer.employees),
    (0, typeorm_1.JoinColumn)({ name: 'realEstateDeveloperId' }),
    __metadata("design:type", real_estate_developer_entity_1.RealEstateDeveloper)
], RealEstateDeveloperEmployee.prototype, "realEstateDeveloper", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RealEstateDeveloperEmployee.prototype, "realEstateDeveloperId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => office_entity_1.Office, (office) => office.employees),
    (0, typeorm_1.JoinColumn)({ name: 'officeId' }),
    __metadata("design:type", office_entity_1.Office)
], RealEstateDeveloperEmployee.prototype, "office", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RealEstateDeveloperEmployee.prototype, "officeId", void 0);
exports.RealEstateDeveloperEmployee = RealEstateDeveloperEmployee = __decorate([
    (0, typeorm_1.Entity)('real_estate_developer_employees')
], RealEstateDeveloperEmployee);
//# sourceMappingURL=real-estate-developer-employee.entity.js.map