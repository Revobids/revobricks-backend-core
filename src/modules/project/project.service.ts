import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../../entities/project.entity';
import {
  ProjectEmployee,
  ProjectRole,
} from '../../entities/project-employee.entity';
import {
  RealEstateDeveloperEmployee,
  UserRole,
} from '../../entities/real-estate-developer-employee.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { GetProjectsDto } from './dto/get-projects.dto';
import { Bookmark } from '../../entities/bookmark.entity';
import { PublishProjectDto } from './dto/publish-project.dto';
import { UploadImageDto, UploadImageResponseDto } from './dto/upload-image.dto';
import { DeleteImageResponseDto } from './dto/delete-image-response.dto';
import { S3Service } from '../../services/s3.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectEmployee)
    private projectEmployeeRepository: Repository<ProjectEmployee>,
    @InjectRepository(RealEstateDeveloperEmployee)
    private userRepository: Repository<RealEstateDeveloperEmployee>,
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    private s3Service: S3Service,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    user: RealEstateDeveloperEmployee,
  ): Promise<Project> {
    const { projectManagerId, salesManagerId, ...projectData } =
      createProjectDto;

    const projectManager = await this.userRepository.findOne({
      where: {
        id: projectManagerId,
        realEstateDeveloperId: user.realEstateDeveloperId,
        isActive: true,
      },
    });

    if (!projectManager) {
      throw new NotFoundException(
        'Project manager not found or not from your organization',
      );
    }

    const salesManager = await this.userRepository.findOne({
      where: {
        id: salesManagerId,
        realEstateDeveloperId: user.realEstateDeveloperId,
        isActive: true,
      },
    });

    if (!salesManager) {
      throw new NotFoundException(
        'Sales manager not found or not from your organization',
      );
    }

    const project = this.projectRepository.create({
      ...projectData,
      realEstateDeveloperId: user.realEstateDeveloperId,
      projectManagerId,
      salesManagerId,
      currency: projectData.currency || 'INR',
    });

    const savedProject = await this.projectRepository.save(project);

    await this.projectEmployeeRepository.save([
      {
        projectId: savedProject.id,
        employeeId: projectManagerId,
        role: ProjectRole.PROJECT_MANAGER,
        assignedDate: new Date(),
      },
      {
        projectId: savedProject.id,
        employeeId: salesManagerId,
        role: ProjectRole.SALES_MANAGER,
        assignedDate: new Date(),
      },
    ]);

    return this.findOne(savedProject.id, user);
  }

  async findAll(user: RealEstateDeveloperEmployee): Promise<Project[]> {
    return this.projectRepository.find({
      where: {
        realEstateDeveloperId: user.realEstateDeveloperId,
        isActive: true,
      },
      relations: [
        'projectManager',
        'salesManager',
        'projectEmployees',
        'projectEmployees.employee',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string, user: RealEstateDeveloperEmployee): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: {
        id,
        realEstateDeveloperId: user.realEstateDeveloperId,
        isActive: true,
      },
      relations: [
        'projectManager',
        'salesManager',
        'projectEmployees',
        'projectEmployees.employee',
      ],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: RealEstateDeveloperEmployee,
  ): Promise<Project> {
    const project = await this.findOne(id, user);

    if (updateProjectDto.status && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only owners can change project status');
    }

    Object.assign(project, updateProjectDto);
    await this.projectRepository.save(project);

    return this.findOne(id, user);
  }

  async publishProject(
    id: string,
    publishProjectDto: PublishProjectDto,
    user: RealEstateDeveloperEmployee,
  ): Promise<Project> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Only owners can publish/unpublish projects',
      );
    }

    const project = await this.findOne(id, user);

    if (publishProjectDto.status === ProjectStatus.PUBLISHED) {
      if (!project.reraNumber) {
        throw new BadRequestException(
          'Cannot publish project without RERA number',
        );
      }
      if (!project.legalDetails) {
        throw new BadRequestException(
          'Cannot publish project without legal details',
        );
      }
      if (!project.approvals || project.approvals.length === 0) {
        throw new BadRequestException(
          'Cannot publish project without approvals',
        );
      }
    }

    project.status = publishProjectDto.status;
    await this.projectRepository.save(project);

    return project;
  }

  async assignEmployee(
    projectId: string,
    assignEmployeeDto: AssignEmployeeDto,
    user: RealEstateDeveloperEmployee,
  ): Promise<ProjectEmployee> {
    const project = await this.findOne(projectId, user);

    const employee = await this.userRepository.findOne({
      where: {
        id: assignEmployeeDto.employeeId,
        realEstateDeveloperId: user.realEstateDeveloperId,
        isActive: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(
        'Employee not found or not from your organization',
      );
    }

    const existingAssignment = await this.projectEmployeeRepository.findOne({
      where: {
        projectId,
        employeeId: assignEmployeeDto.employeeId,
        isActive: true,
      },
    });

    if (existingAssignment) {
      throw new BadRequestException(
        'Employee already assigned to this project',
      );
    }

    const projectEmployee = this.projectEmployeeRepository.create({
      projectId,
      employeeId: assignEmployeeDto.employeeId,
      role: assignEmployeeDto.role,
      assignedDate: assignEmployeeDto.assignedDate || new Date(),
    });

    return this.projectEmployeeRepository.save(projectEmployee);
  }

  async removeEmployee(
    projectId: string,
    employeeId: string,
    user: RealEstateDeveloperEmployee,
  ): Promise<void> {
    const project = await this.findOne(projectId, user);

    if (
      project.projectManagerId === employeeId ||
      project.salesManagerId === employeeId
    ) {
      throw new BadRequestException(
        'Cannot remove project manager or sales manager',
      );
    }

    const assignment = await this.projectEmployeeRepository.findOne({
      where: {
        projectId,
        employeeId,
        isActive: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Employee assignment not found');
    }

    assignment.isActive = false;
    await this.projectEmployeeRepository.save(assignment);
  }

  async uploadImages(
    id: string,
    files: Express.Multer.File[],
    uploadImageDto: UploadImageDto,
    user: RealEstateDeveloperEmployee,
  ): Promise<UploadImageResponseDto[]> {
    const project = await this.findOne(id, user);
    const results: UploadImageResponseDto[] = [];

    // Upload each file to S3
    for (const file of files) {
      const uploadResult = await this.s3Service.uploadFile(file, {
        folder: `projects/${id}/images`,
        contentType: file.mimetype,
        metadata: {
          projectId: id,
          uploadedBy: user.id,
          imageType: uploadImageDto.type || 'OTHER',
          caption: uploadImageDto.caption || '',
        },
      });

      // Create image object with url, type, and caption
      const imageObject = {
        url: uploadResult.url,
        type: uploadImageDto.type || 'OTHER',
        caption: uploadImageDto.caption || '',
      };

      // Add to project images array
      const currentImages = project.images || [];
      currentImages.push(imageObject);
      project.images = currentImages;

      // Add to results
      results.push({
        url: uploadResult.url,
        type: uploadImageDto.type || 'OTHER',
        caption: uploadImageDto.caption || '',
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
      });
    }

    await this.projectRepository.save(project);
    return results;
  }

  async deleteImage(
    id: string,
    imageUrl: string,
    user: RealEstateDeveloperEmployee,
  ): Promise<DeleteImageResponseDto> {
    const project = await this.findOne(id, user);

    if (!project.images || !project.images.some(img => img.url === imageUrl)) {
      throw new NotFoundException('Image not found in project');
    }

    // Extract S3 key from URL
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const s3Key = imageUrl.replace(`https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`, '');

    // Delete from S3
    await this.s3Service.deleteFile(s3Key);

    // Remove from project images array
    project.images = project.images.filter(img => img.url !== imageUrl);
    await this.projectRepository.save(project);

    // Return success message with details
    return {
      message: 'Image deleted successfully',
      deletedImageUrl: imageUrl,
      remainingImagesCount: project.images.length,
    };
  }

  async remove(id: string, user: RealEstateDeveloperEmployee): Promise<void> {
    const project = await this.findOne(id, user);

    project.isActive = false;
    await this.projectRepository.save(project);
  }

  async getPublishedProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      where: {
        status: ProjectStatus.PUBLISHED,
        isActive: true,
      },
      relations: ['realEstateDeveloper'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getPublishedProjectsWithFilters(filters: GetProjectsDto): Promise<Project[]> {
    const query = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.realEstateDeveloper', 'developer')
      .where('project.status = :status', { status: ProjectStatus.PUBLISHED })
      .andWhere('project.isActive = :isActive', { isActive: true });

    if (filters.city) {
      query.andWhere('LOWER(project.city) = LOWER(:city)', { city: filters.city });
    }

    if (filters.state) {
      query.andWhere('LOWER(project.state) = LOWER(:state)', { state: filters.state });
    }

    if (filters.minPrice !== undefined) {
      query.andWhere('project.minPrice >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice !== undefined) {
      query.andWhere('project.maxPrice <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.projectType) {
      query.andWhere('project.projectType = :projectType', { projectType: filters.projectType });
    }

    if (filters.propertyType) {
      query.andWhere('project.propertyType = :propertyType', { propertyType: filters.propertyType });
    }

    return query.orderBy('project.createdAt', 'DESC').getMany();
  }

  async getPublishedProjectById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: {
        id,
        status: ProjectStatus.PUBLISHED,
        isActive: true,
      },
      relations: ['realEstateDeveloper'],
    });

    if (!project) {
      throw new NotFoundException('Project not found or not published');
    }

    return project;
  }

  async getPublishedProjectWithBookmark(
    projectId: string,
    userId: string,
  ): Promise<Project & { isBookmarked: boolean }> {
    const project = await this.getPublishedProjectById(projectId);

    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId },
      },
    });

    return {
      ...project,
      isBookmarked: !!bookmark,
    };
  }
}
