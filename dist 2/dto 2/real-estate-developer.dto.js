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
exports.UpdateRealEstateDeveloperDto = exports.CreateRealEstateDeveloperDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateRealEstateDeveloperDto {
    name;
    description;
    address;
    phone;
    email;
    ownerUsername;
    ownerPassword;
    ownerEmail;
    ownerName;
}
exports.CreateRealEstateDeveloperDto = CreateRealEstateDeveloperDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ABC Real Estate' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRealEstateDeveloperDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Leading real estate developer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRealEstateDeveloperDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123 Main St, City' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRealEstateDeveloperDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+1234567890' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRealEstateDeveloperDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'contact@abcrealestate.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateRealEstateDeveloperDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRealEstateDeveloperDto.prototype, "ownerUsername", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123', minLength: 6 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateRealEstateDeveloperDto.prototype, "ownerPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@abcrealestate.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateRealEstateDeveloperDto.prototype, "ownerEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRealEstateDeveloperDto.prototype, "ownerName", void 0);
class UpdateRealEstateDeveloperDto extends (0, swagger_1.PartialType)(CreateRealEstateDeveloperDto) {
}
exports.UpdateRealEstateDeveloperDto = UpdateRealEstateDeveloperDto;
//# sourceMappingURL=real-estate-developer.dto.js.map