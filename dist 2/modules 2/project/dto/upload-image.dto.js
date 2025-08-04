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
exports.UploadImageResponseDto = exports.UploadImageDto = exports.ImageType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ImageType;
(function (ImageType) {
    ImageType["EXTERIOR"] = "EXTERIOR";
    ImageType["INTERIOR"] = "INTERIOR";
    ImageType["FLOOR_PLAN"] = "FLOOR_PLAN";
    ImageType["AMENITY"] = "AMENITY";
    ImageType["LOCATION"] = "LOCATION";
    ImageType["CONSTRUCTION"] = "CONSTRUCTION";
    ImageType["OTHER"] = "OTHER";
})(ImageType || (exports.ImageType = ImageType = {}));
class UploadImageDto {
    type = ImageType.OTHER;
    caption;
}
exports.UploadImageDto = UploadImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ImageType,
        description: 'Type of image being uploaded',
        default: ImageType.OTHER,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ImageType),
    __metadata("design:type", String)
], UploadImageDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Caption for the image',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadImageDto.prototype, "caption", void 0);
class UploadImageResponseDto {
    url;
    type;
    caption;
    fileSize;
    mimeType;
}
exports.UploadImageResponseDto = UploadImageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Uploaded image URL' }),
    __metadata("design:type", String)
], UploadImageResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Image type' }),
    __metadata("design:type", String)
], UploadImageResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Image caption' }),
    __metadata("design:type", String)
], UploadImageResponseDto.prototype, "caption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    __metadata("design:type", Number)
], UploadImageResponseDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'MIME type' }),
    __metadata("design:type", String)
], UploadImageResponseDto.prototype, "mimeType", void 0);
//# sourceMappingURL=upload-image.dto.js.map