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
exports.RealEstateDeveloper = void 0;
const typeorm_1 = require("typeorm");
const real_estate_developer_employee_entity_1 = require("./real-estate-developer-employee.entity");
const office_entity_1 = require("./office.entity");
let RealEstateDeveloper = class RealEstateDeveloper {
    id;
    name;
    description;
    address;
    phone;
    email;
    isActive;
    createdAt;
    updatedAt;
    employees;
    offices;
};
exports.RealEstateDeveloper = RealEstateDeveloper;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RealEstateDeveloper.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], RealEstateDeveloper.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RealEstateDeveloper.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RealEstateDeveloper.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RealEstateDeveloper.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RealEstateDeveloper.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], RealEstateDeveloper.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RealEstateDeveloper.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RealEstateDeveloper.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => real_estate_developer_employee_entity_1.RealEstateDeveloperEmployee, (employee) => employee.realEstateDeveloper),
    __metadata("design:type", Array)
], RealEstateDeveloper.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => office_entity_1.Office, (office) => office.realEstateDeveloper),
    __metadata("design:type", Array)
], RealEstateDeveloper.prototype, "offices", void 0);
exports.RealEstateDeveloper = RealEstateDeveloper = __decorate([
    (0, typeorm_1.Entity)('real_estate_developers')
], RealEstateDeveloper);
//# sourceMappingURL=real-estate-developer.entity.js.map