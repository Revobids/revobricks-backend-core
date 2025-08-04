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
exports.Office = void 0;
const typeorm_1 = require("typeorm");
const real_estate_developer_entity_1 = require("./real-estate-developer.entity");
const real_estate_developer_employee_entity_1 = require("./real-estate-developer-employee.entity");
let Office = class Office {
    id;
    name;
    address;
    city;
    state;
    region;
    phone;
    isMainOffice;
    isActive;
    createdAt;
    updatedAt;
    realEstateDeveloper;
    realEstateDeveloperId;
    employees;
};
exports.Office = Office;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Office.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Office.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Office.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Office.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Office.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Office.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Office.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Office.prototype, "isMainOffice", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Office.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Office.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Office.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => real_estate_developer_entity_1.RealEstateDeveloper, (developer) => developer.offices),
    (0, typeorm_1.JoinColumn)({ name: 'realEstateDeveloperId' }),
    __metadata("design:type", real_estate_developer_entity_1.RealEstateDeveloper)
], Office.prototype, "realEstateDeveloper", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Office.prototype, "realEstateDeveloperId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => real_estate_developer_employee_entity_1.RealEstateDeveloperEmployee, (employee) => employee.office),
    __metadata("design:type", Array)
], Office.prototype, "employees", void 0);
exports.Office = Office = __decorate([
    (0, typeorm_1.Entity)('offices')
], Office);
//# sourceMappingURL=office.entity.js.map