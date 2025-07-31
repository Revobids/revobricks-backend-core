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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { PublishProjectDto } from './dto/publish-project.dto';
import { UploadImageDto, UploadImageResponseDto } from './dto/upload-image.dto';
import { DeleteImageDto } from './dto/delete-image.dto';
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

  @Post(':id/upload-image')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload image file with optional metadata',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload (JPEG, PNG, WebP)',
        },
        type: {
          type: 'string',
          enum: ['EXTERIOR', 'INTERIOR', 'FLOOR_PLAN', 'AMENITY', 'LOCATION', 'CONSTRUCTION', 'OTHER'],
          description: 'Type of image',
          default: 'OTHER',
        },
        caption: {
          type: 'string',
          description: 'Caption for the image',
        },
      },
      required: ['image'],
    },
  })
  @ApiOperation({ summary: 'Upload an image for a project' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully', type: UploadImageResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - invalid file or missing data' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadImageDto: UploadImageDto,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<UploadImageResponseDto> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP images are allowed');
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB');
    }

    return this.projectService.uploadImage(id, file, uploadImageDto, user);
  }

  @Delete(':id/images')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an image from a project' })
  @ApiResponse({ status: 204, description: 'Image deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid image URL' })
  @ApiResponse({ status: 404, description: 'Project or image not found' })
  async deleteImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() deleteImageDto: DeleteImageDto,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<void> {
    return this.projectService.deleteImage(id, deleteImageDto.imageUrl, user);
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
