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
import { PublishProjectDto } from './dto/publish-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectEmployee)
    private projectEmployeeRepository: Repository<ProjectEmployee>,
    @InjectRepository(RealEstateDeveloperEmployee)
    private userRepository: Repository<RealEstateDeveloperEmployee>,
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
}
