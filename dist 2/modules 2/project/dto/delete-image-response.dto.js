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
exports.DeleteImageResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DeleteImageResponseDto {
    message;
    deletedImageUrl;
    remainingImagesCount;
}
exports.DeleteImageResponseDto = DeleteImageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Image deleted successfully',
    }),
    __metadata("design:type", String)
], DeleteImageResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL of the deleted image',
        example: 'https://revobids-images.s3.eu-north-1.amazonaws.com/projects/uuid/images/image.jpg',
    }),
    __metadata("design:type", String)
], DeleteImageResponseDto.prototype, "deletedImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of remaining images in the project',
        example: 5,
    }),
    __metadata("design:type", Number)
], DeleteImageResponseDto.prototype, "remainingImagesCount", void 0);
//# sourceMappingURL=delete-image-response.dto.js.map