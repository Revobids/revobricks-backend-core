import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { SearchProjectsDto } from './dto/search-projects.dto';
import { GetProjectsDto } from './dto/get-projects.dto';
import { Project } from '../../entities/project.entity';

@ApiTags('public-projects')
@Controller('public/projects')
export class PublicProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published projects (public)' })
  @ApiResponse({ status: 200, description: 'List of published projects' })
  async getPublishedProjects(@Query() filters: GetProjectsDto): Promise<Project[]> {
    if (Object.keys(filters).length > 0) {
      return this.projectService.getPublishedProjectsWithFilters(filters);
    }
    return this.projectService.getPublishedProjects();
  }

  @Post('search')
  @ApiOperation({ summary: 'Search published projects with fuzzy matching (public)' })
  @ApiResponse({ status: 200, description: 'Search results' })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  async searchProjects(
    @Body() searchDto: SearchProjectsDto,
  ): Promise<Project[]> {
    return this.projectService.searchPublishedProjects(searchDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search published projects with query parameters (public)' })
  @ApiResponse({ status: 200, description: 'Search results' })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  async searchProjectsGet(
    @Query() searchDto: SearchProjectsDto,
  ): Promise<Project[]> {
    return this.projectService.searchPublishedProjects(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a published project by ID (public)' })
  @ApiResponse({ status: 200, description: 'Project found' })
  @ApiResponse({ status: 404, description: 'Project not found or not published' })
  async getPublishedProject(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Project> {
    return this.projectService.getPublishedProjectById(id);
  }
}