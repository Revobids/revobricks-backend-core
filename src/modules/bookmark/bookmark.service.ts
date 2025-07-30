import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../../entities/bookmark.entity';
import { Project, ProjectStatus } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addBookmark(userId: string, projectId: string): Promise<Bookmark> {
    const project = await this.projectRepository.findOne({
      where: {
        id: projectId,
        status: ProjectStatus.PUBLISHED,
        isActive: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found or not published');
    }

    const existingBookmark = await this.bookmarkRepository.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId },
      },
    });

    if (existingBookmark) {
      throw new ConflictException('Project already bookmarked');
    }

    const bookmark = this.bookmarkRepository.create({
      user: { id: userId },
      project: { id: projectId },
    });

    return this.bookmarkRepository.save(bookmark);
  }

  async removeBookmark(userId: string, projectId: string): Promise<void> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId },
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    await this.bookmarkRepository.remove(bookmark);
  }

  async getUserBookmarks(userId: string): Promise<Project[]> {
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
      .filter((project) => project.status === ProjectStatus.PUBLISHED && project.isActive);
  }

  async isProjectBookmarked(userId: string, projectId: string): Promise<boolean> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId },
      },
    });

    return !!bookmark;
  }
}