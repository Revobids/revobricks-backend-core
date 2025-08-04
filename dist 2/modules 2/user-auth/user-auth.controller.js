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
exports.UserAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_auth_service_1 = require("./user-auth.service");
const user_auth_dto_1 = require("../../dto/user-auth.dto");
const user_jwt_auth_guard_1 = require("../../guards/user-jwt-auth.guard");
let UserAuthController = class UserAuthController {
    userAuthService;
    constructor(userAuthService) {
        this.userAuthService = userAuthService;
    }
    async authenticateWithFirebase(firebaseAuthDto) {
        return this.userAuthService.authenticateWithFirebase(firebaseAuthDto);
    }
    async getProfile(req) {
        return this.userAuthService.getProfile(req.user.id);
    }
    async updateProfile(req, updateUserProfileDto) {
        return this.userAuthService.updateProfile(req.user.id, updateUserProfileDto);
    }
};
exports.UserAuthController = UserAuthController;
__decorate([
    (0, common_1.Post)('authenticate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Authenticate with Firebase ID token (Phone OTP or Google)',
        description: 'Send Firebase ID token from client. Works for both phone OTP and Google authentication. Creates account if user doesn\'t exist.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User authenticated successfully',
        type: user_auth_dto_1.AuthResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid Firebase ID token' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Authentication failed' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_auth_dto_1.FirebaseAuthDto]),
    __metadata("design:returntype", Promise)
], UserAuthController.prototype, "authenticateWithFirebase", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(user_jwt_auth_guard_1.UserJwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserAuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(user_jwt_auth_guard_1.UserJwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_auth_dto_1.UpdateUserProfileDto]),
    __metadata("design:returntype", Promise)
], UserAuthController.prototype, "updateProfile", null);
exports.UserAuthController = UserAuthController = __decorate([
    (0, swagger_1.ApiTags)('User Authentication'),
    (0, common_1.Controller)('auth/users'),
    __metadata("design:paramtypes", [user_auth_service_1.UserAuthService])
], UserAuthController);
//# sourceMappingURL=user-auth.controller.js.map