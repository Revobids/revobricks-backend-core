import {
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { Project } from '../../entities/project.entity';
import { GetProjectsDto } from './dto/get-projects.dto';
import { UserJwtAuthGuard } from '../../guards/user-jwt-auth.guard';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('public/projects')
@Controller('public/projects')
export class PublicProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published projects with optional filters' })
  @ApiResponse({ status: 200, description: 'List of published projects' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'state', required: false, description: 'Filter by state' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'projectType', required: false, enum: ['RESIDENTIAL', 'COMMERCIAL', 'MIXED_USE'] })
  @ApiQuery({ name: 'propertyType', required: false, enum: ['APARTMENT', 'VILLA', 'PLOT', 'OFFICE', 'SHOP', 'WAREHOUSE'] })
  async getProjects(@Query() query: GetProjectsDto): Promise<Project[]> {
    return this.projectService.getPublishedProjectsWithFilters(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a published project by ID' })
  @ApiResponse({ status: 200, description: 'Project details' })
  @ApiResponse({ status: 404, description: 'Project not found or not published' })
  async getProject(@Param('id', ParseUUIDPipe) id: string): Promise<Project> {
    return this.projectService.getPublishedProjectById(id);
  }

  @Get(':id/with-bookmark')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a published project with bookmark status' })
  @ApiResponse({ status: 200, description: 'Project details with bookmark status' })
  @ApiResponse({ status: 404, description: 'Project not found or not published' })
  async getProjectWithBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<Project & { isBookmarked: boolean }> {
    return this.projectService.getPublishedProjectWithBookmark(id, user.id);
  }
}