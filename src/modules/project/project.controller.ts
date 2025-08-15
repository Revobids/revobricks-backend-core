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
  UploadedFiles,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import {
  NearbyFacilitiesService,
  Facility,
} from '../../services/nearby-facilities.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { PublishProjectDto } from './dto/publish-project.dto';
import { UploadImageDto, UploadImageResponseDto } from './dto/upload-image.dto';
import { DeleteImageDto } from './dto/delete-image.dto';
import { DeleteImageResponseDto } from './dto/delete-image-response.dto';
import {
  UploadBrochureDto,
  UploadBrochureResponseDto,
} from './dto/upload-brochure.dto';
import {
  DeleteBrochureDto,
  DeleteBrochureResponseDto,
} from './dto/delete-brochure.dto';

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
  constructor(
    private readonly projectService: ProjectService,
    private readonly nearbyFacilitiesService: NearbyFacilitiesService,
  ) {}

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
  async findAll(
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<Project[]> {
    return this.projectService.findAll(user);
  }

  @Get('published')
  @ApiOperation({ summary: 'Get all published projects (public)' })
  @ApiResponse({ status: 200, description: 'List of published projects' })
  async getPublishedProjects(): Promise<Project[]> {
    return this.projectService.getPublishedProjects();
  }

  @Get('developer/:developerId')
  @ApiOperation({ summary: 'Get projects by developer ID' })
  @ApiResponse({ status: 200, description: 'List of projects by developer' })
  async getProjectsByDeveloper(
    @Param('developerId', ParseUUIDPipe) developerId: string,
  ): Promise<Project[]> {
    return this.projectService.getProjectsByDeveloper(developerId);
  }

  @Get(':id/nearby-facilities')
  @ApiOperation({ summary: 'Get nearby facilities for a project' })
  @ApiResponse({ status: 200, description: 'List of nearby facilities' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getNearbyFacilities(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: RealEstateDeveloperEmployee,
    @Query('radius') radius?: number,
    @Query('type') type?: string,
  ): Promise<Facility[]> {
    const project = await this.projectService.findOne(id, user);
    return this.nearbyFacilitiesService.getNearbyFacilities(
      project.latitude,
      project.longitude,
      radius || 5000,
      type || 'school',
    );
  }

  @Get(':id/closest-facilities')
  @ApiOperation({
    summary: 'Get the closest facility of each type for a project (within 5km)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of closest facilities by type',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getClosestFacilitiesByType(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<Facility[]> {
    const project = await this.projectService.findOne(id, user);

    return this.nearbyFacilitiesService.getClosestFacilitiesByType(
      project.latitude,
      project.longitude,
      5000, // Fixed 5km radius
    );
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

  @Post(':id/upload-images')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('images', 10)) // Allow up to 10 files
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload multiple image files with shared metadata',
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Multiple image files to upload (JPEG, PNG, WebP)',
        },
        type: {
          type: 'string',
          enum: [
            'EXTERIOR',
            'INTERIOR',
            'FLOOR_PLAN',
            'AMENITY',
            'LOCATION',
            'CONSTRUCTION',
            'OTHER',
          ],
          description: 'Type of images (applies to all uploaded images)',
          default: 'OTHER',
        },
        caption: {
          type: 'string',
          description:
            'Caption for the images (applies to all uploaded images)',
        },
      },
      required: ['images'],
    },
  })
  @ApiOperation({
    summary: 'Upload multiple images for a project (ADMIN only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Images uploaded successfully',
    type: [UploadImageResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid files or missing data',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async uploadImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadImageDto: UploadImageDto,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<UploadImageResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No image files provided');
    }

    // Validate each file
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file type for ${file.originalname}. Only JPEG, PNG, and WebP images are allowed`,
        );
      }
      if (file.size > maxSize) {
        throw new BadRequestException(
          `File ${file.originalname} is too large. Maximum size is 5MB`,
        );
      }
    }

    return this.projectService.uploadImages(id, files, uploadImageDto, user);
  }

  @Post(':id/upload-brochure')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('brochure', 1)) // Allow only 1 PDF file
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a PDF brochure for the project',
    schema: {
      type: 'object',
      properties: {
        brochure: {
          type: 'string',
          format: 'binary',
          description: 'PDF brochure file to upload',
        },
        name: {
          type: 'string',
          description: 'Name for the brochure (optional)',
          example: 'Project Brochure 2024',
        },
      },
      required: ['brochure'],
    },
  })
  @ApiOperation({
    summary: 'Upload a PDF brochure for a project (ADMIN only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Brochure uploaded successfully',
    type: UploadBrochureResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid file or missing data',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async uploadBrochure(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadBrochureDto: UploadBrochureDto,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<UploadBrochureResponseDto> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No brochure file provided');
    }

    const file = files[0];

    // Validate file type - only PDF allowed
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException(
        'Invalid file type. Only PDF files are allowed for brochures',
      );
    }

    // Validate file size - max 10MB for PDFs
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException(
        'File is too large. Maximum size is 10MB for brochures',
      );
    }

    return this.projectService.uploadBrochure(
      id,
      file,
      uploadBrochureDto,
      user,
    );
  }

  @Delete(':id/brochures')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a brochure from a project (ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'Brochure deleted successfully',
    type: DeleteBrochureResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid brochure URL',
  })
  @ApiResponse({ status: 404, description: 'Project or brochure not found' })
  async deleteBrochure(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() deleteBrochureDto: DeleteBrochureDto,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<DeleteBrochureResponseDto> {
    return this.projectService.deleteBrochure(
      id,
      deleteBrochureDto.brochureUrl,
      user,
    );
  }

  @Delete(':id/images')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an image from a project (ADMIN only)' })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
    type: DeleteImageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid image URL' })
  @ApiResponse({ status: 404, description: 'Project or image not found' })
  async deleteImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() deleteImageDto: DeleteImageDto,
    @GetUser() user: RealEstateDeveloperEmployee,
  ): Promise<DeleteImageResponseDto> {
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
