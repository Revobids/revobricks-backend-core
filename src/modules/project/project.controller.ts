import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { PublishProjectDto } from './dto/publish-project.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { GetUser } from '../../decorators/get-user.decorator';
import {
  RealEstateDeveloperEmployee,
  UserRole,
} from '../../entities/real-estate-developer-employee.entity';
import { Project } from '../../entities/project.entity';
import { ProjectEmployee } from '../../entities/project-employee.entity';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<Project> {
    return this.projectService.create(createProjectDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects for the organization' })
  @ApiResponse({ status: 200, description: 'List of projects' })
  async findAll(@GetUser() user: RealEstateDeveloperEmployee): Promise<Project[]> {
    return this.projectService.findAll(user);
  }

  @Get('published')
  @ApiOperation({ summary: 'Get all published projects (public)' })
  @ApiResponse({ status: 200, description: 'List of published projects' })
  async getPublishedProjects(): Promise<Project[]> {
    return this.projectService.getPublishedProjects();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project found' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<Project> {
    return this.projectService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<Project> {
    return this.projectService.update(id, updateProjectDto, user);
  }

  @Patch(':id/publish')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish or unpublish a project (Owner only)' })
  @ApiResponse({ status: 200, description: 'Project status updated' })
  @ApiResponse({
    status: 400,
    description: 'Cannot publish without required details',
  })
  @ApiResponse({ status: 403, description: 'Only owners can publish projects' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async publishProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() publishProjectDto: PublishProjectDto,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<Project> {
    return this.projectService.publishProject(id, publishProjectDto, user);
  }

  @Post(':id/employees')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Assign an employee to a project' })
  @ApiResponse({ status: 201, description: 'Employee assigned successfully' })
  @ApiResponse({ status: 400, description: 'Employee already assigned' })
  @ApiResponse({ status: 404, description: 'Project or employee not found' })
  async assignEmployee(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignEmployeeDto: AssignEmployeeDto,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<ProjectEmployee> {
    return this.projectService.assignEmployee(id, assignEmployeeDto, user);
  }

  @Delete(':id/employees/:employeeId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an employee from a project' })
  @ApiResponse({ status: 204, description: 'Employee removed successfully' })
  @ApiResponse({ status: 400, description: 'Cannot remove manager' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async removeEmployee(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<void> {
    return this.projectService.removeEmployee(id, employeeId, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a project' })
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<void> {
    return this.projectService.remove(id, user);
  }
}
