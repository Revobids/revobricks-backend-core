import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { ProjectEmployee } from '../../entities/project-employee.entity';
import { RealEstateDeveloperEmployee } from '../../entities/real-estate-developer-employee.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { GetProjectsDto } from './dto/get-projects.dto';
import { Bookmark } from '../../entities/bookmark.entity';
import { PublishProjectDto } from './dto/publish-project.dto';
import { UploadImageDto, UploadImageResponseDto } from './dto/upload-image.dto';
import { DeleteImageResponseDto } from './dto/delete-image-response.dto';
import { S3Service } from '../../services/s3.service';
export declare class ProjectService {
    private projectRepository;
    private projectEmployeeRepository;
    private userRepository;
    private bookmarkRepository;
    private s3Service;
    constructor(projectRepository: Repository<Project>, projectEmployeeRepository: Repository<ProjectEmployee>, userRepository: Repository<RealEstateDeveloperEmployee>, bookmarkRepository: Repository<Bookmark>, s3Service: S3Service);
    create(createProjectDto: CreateProjectDto, user: RealEstateDeveloperEmployee): Promise<Project>;
    findAll(user: RealEstateDeveloperEmployee): Promise<Project[]>;
    findOne(id: string, user: RealEstateDeveloperEmployee): Promise<Project>;
    update(id: string, updateProjectDto: UpdateProjectDto, user: RealEstateDeveloperEmployee): Promise<Project>;
    publishProject(id: string, publishProjectDto: PublishProjectDto, user: RealEstateDeveloperEmployee): Promise<Project>;
    assignEmployee(projectId: string, assignEmployeeDto: AssignEmployeeDto, user: RealEstateDeveloperEmployee): Promise<ProjectEmployee>;
    removeEmployee(projectId: string, employeeId: string, user: RealEstateDeveloperEmployee): Promise<void>;
    uploadImages(id: string, files: Express.Multer.File[], uploadImageDto: UploadImageDto, user: RealEstateDeveloperEmployee): Promise<UploadImageResponseDto[]>;
    deleteImage(id: string, imageUrl: string, user: RealEstateDeveloperEmployee): Promise<DeleteImageResponseDto>;
    remove(id: string, user: RealEstateDeveloperEmployee): Promise<void>;
    getPublishedProjects(): Promise<Project[]>;
    getPublishedProjectsWithFilters(filters: GetProjectsDto): Promise<Project[]>;
    getPublishedProjectById(id: string): Promise<Project>;
    getPublishedProjectWithBookmark(projectId: string, userId: string): Promise<Project & {
        isBookmarked: boolean;
    }>;
}
