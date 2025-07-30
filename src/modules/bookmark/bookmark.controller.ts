import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookmarkService } from './bookmark.service';
import { UserJwtAuthGuard } from '../../guards/user-jwt-auth.guard';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../../entities/user.entity';
import { Bookmark } from '../../entities/bookmark.entity';
import { Project } from '../../entities/project.entity';

@ApiTags('bookmarks')
@Controller('bookmarks')
@UseGuards(UserJwtAuthGuard)
@ApiBearerAuth()
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('projects/:projectId')
  @ApiOperation({ summary: 'Bookmark a project' })
  @ApiResponse({ status: 201, description: 'Project bookmarked successfully' })
  @ApiResponse({ status: 404, description: 'Project not found or not published' })
  @ApiResponse({ status: 409, description: 'Project already bookmarked' })
  async addBookmark(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @GetUser() user: User,
  ): Promise<Bookmark> {
    return this.bookmarkService.addBookmark(user.id, projectId);
  }

  @Delete('projects/:projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove bookmark from a project' })
  @ApiResponse({ status: 204, description: 'Bookmark removed successfully' })
  @ApiResponse({ status: 404, description: 'Bookmark not found' })
  async removeBookmark(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.bookmarkService.removeBookmark(user.id, projectId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookmarked projects for the user' })
  @ApiResponse({ status: 200, description: 'List of bookmarked projects' })
  async getUserBookmarks(@GetUser() user: User): Promise<Project[]> {
    return this.bookmarkService.getUserBookmarks(user.id);
  }

  @Get('projects/:projectId/status')
  @ApiOperation({ summary: 'Check if a project is bookmarked' })
  @ApiResponse({ status: 200, description: 'Bookmark status' })
  async getBookmarkStatus(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @GetUser() user: User,
  ): Promise<{ isBookmarked: boolean }> {
    const isBookmarked = await this.bookmarkService.isProjectBookmarked(
      user.id,
      projectId,
    );
    return { isBookmarked };
  }
}