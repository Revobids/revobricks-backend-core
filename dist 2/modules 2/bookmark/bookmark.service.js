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
exports.BookmarkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bookmark_entity_1 = require("../../entities/bookmark.entity");
const project_entity_1 = require("../../entities/project.entity");
const user_entity_1 = require("../../entities/user.entity");
let BookmarkService = class BookmarkService {
    bookmarkRepository;
    projectRepository;
    userRepository;
    constructor(bookmarkRepository, projectRepository, userRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }
    async addBookmark(userId, projectId) {
        const project = await this.projectRepository.findOne({
            where: {
                id: projectId,
                status: project_entity_1.ProjectStatus.PUBLISHED,
                isActive: true,
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found or not published');
        }
        const existingBookmark = await this.bookmarkRepository.findOne({
            where: {
                user: { id: userId },
                project: { id: projectId },
            },
        });
        if (existingBookmark) {
            throw new common_1.ConflictException('Project already bookmarked');
        }
        const bookmark = this.bookmarkRepository.create({
            user: { id: userId },
            project: { id: projectId },
        });
        return this.bookmarkRepository.save(bookmark);
    }
    async removeBookmark(userId, projectId) {
        const bookmark = await this.bookmarkRepository.findOne({
            where: {
                user: { id: userId },
                project: { id: projectId },
            },
        });
        if (!bookmark) {
            throw new common_1.NotFoundException('Bookmark not found');
        }
        await this.bookmarkRepository.remove(bookmark);
    }
    async getUserBookmarks(userId) {
        const bookmarks = await this.bookmarkRepository.find({
            where: {
                user: { id: userId },
            },
            relations: ['project', 'project.realEstateDeveloper'],
            order: {
                createdAt: 'DESC',
            },
        });
        return bookmarks
            .map((bookmark) => bookmark.project)
            .filter((project) => project.status === project_entity_1.ProjectStatus.PUBLISHED && project.isActive);
    }
    async isProjectBookmarked(userId, projectId) {
        const bookmark = await this.bookmarkRepository.findOne({
            where: {
                user: { id: userId },
                project: { id: projectId },
            },
        });
        return !!bookmark;
    }
};
exports.BookmarkService = BookmarkService;
exports.BookmarkService = BookmarkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bookmark_entity_1.Bookmark)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookmarkService);
//# sourceMappingURL=bookmark.service.js.map