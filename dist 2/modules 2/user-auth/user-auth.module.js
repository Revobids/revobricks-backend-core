"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const user_auth_service_1 = require("./user-auth.service");
const user_auth_controller_1 = require("./user-auth.controller");
const user_entity_1 = require("../../entities/user.entity");
const user_jwt_strategy_1 = require("../../auth/user-jwt.strategy");
let UserAuthModule = class UserAuthModule {
};
exports.UserAuthModule = UserAuthModule;
exports.UserAuthModule = UserAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'user-jwt' }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
                signOptions: {
                    expiresIn: process.env.JWT_EXPIRATION || '24h',
                },
            }),
        ],
        controllers: [user_auth_controller_1.UserAuthController],
        providers: [user_auth_service_1.UserAuthService, user_jwt_strategy_1.UserJwtStrategy],
        exports: [user_auth_service_1.UserAuthService, user_jwt_strategy_1.UserJwtStrategy, passport_1.PassportModule],
    })
], UserAuthModule);
//# sourceMappingURL=user-auth.module.js.map