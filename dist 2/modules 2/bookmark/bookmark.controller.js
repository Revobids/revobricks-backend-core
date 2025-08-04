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
exports.BookmarkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bookmark_service_1 = require("./bookmark.service");
const user_jwt_auth_guard_1 = require("../../guards/user-jwt-auth.guard");
const get_user_decorator_1 = require("../../decorators/get-user.decorator");
const user_entity_1 = require("../../entities/user.entity");
let BookmarkController = class BookmarkController {
    bookmarkService;
    constructor(bookmarkService) {
        this.bookmarkService = bookmarkService;
    }
    async addBookmark(projectId, user) {
        return this.bookmarkService.addBookmark(user.id, projectId);
    }
    async removeBookmark(projectId, user) {
        return this.bookmarkService.removeBookmark(user.id, projectId);
    }
    async getUserBookmarks(user) {
        return this.bookmarkService.getUserBookmarks(user.id);
    }
    async getBookmarkStatus(projectId, user) {
        const isBookmarked = await this.bookmarkService.isProjectBookmarked(user.id, projectId);
        return { isBookmarked };
    }
};
exports.BookmarkController = BookmarkController;
__decorate([
    (0, common_1.Post)('projects/:projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Bookmark a project' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Project bookmarked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found or not published' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Project already bookmarked' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "addBookmark", null);
__decorate([
    (0, common_1.Delete)('projects/:projectId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove bookmark from a project' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Bookmark removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Bookmark not found' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "removeBookmark", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bookmarked projects for the user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of bookmarked projects' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "getUserBookmarks", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if a project is bookmarked' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bookmark status' }),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseUUIDPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BookmarkController.prototype, "getBookmarkStatus", null);
exports.BookmarkController = BookmarkController = __decorate([
    (0, swagger_1.ApiTags)('bookmarks'),
    (0, common_1.Controller)('bookmarks'),
    (0, common_1.UseGuards)(user_jwt_auth_guard_1.UserJwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bookmark_service_1.BookmarkService])
], BookmarkController);
//# sourceMappingURL=bookmark.controller.js.map