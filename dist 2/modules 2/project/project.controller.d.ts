import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { PublishProjectDto } from './dto/publish-project.dto';
import { UploadImageDto, UploadImageResponseDto } from './dto/upload-image.dto';
import { DeleteImageDto } from './dto/delete-image.dto';
import { DeleteImageResponseDto } from './dto/delete-image-response.dto';
import { RealEstateDeveloperEmployee } from '../../entities/real-estate-developer-employee.entity';
import { Project } from '../../entities/project.entity';
import { ProjectEmployee } from '../../entities/project-employee.entity';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createProjectDto: CreateProjectDto, user: RealEstateDeveloperEmployee): Promise<Project>;
    findAll(user: RealEstateDeveloperEmployee): Promise<Project[]>;
    getPublishedProjects(): Promise<Project[]>;
    findOne(id: string, user: RealEstateDeveloperEmployee): Promise<Project>;
    update(id: string, updateProjectDto: UpdateProjectDto, user: RealEstateDeveloperEmployee): Promise<Project>;
    publishProject(id: string, publishProjectDto: PublishProjectDto, user: RealEstateDeveloperEmployee): Promise<Project>;
    assignEmployee(id: string, assignEmployeeDto: AssignEmployeeDto, user: RealEstateDeveloperEmployee): Promise<ProjectEmployee>;
    removeEmployee(id: string, employeeId: string, user: RealEstateDeveloperEmployee): Promise<void>;
    uploadImages(id: string, files: Express.Multer.File[], uploadImageDto: UploadImageDto, user: RealEstateDeveloperEmployee): Promise<UploadImageResponseDto[]>;
    deleteImage(id: string, deleteImageDto: DeleteImageDto, user: RealEstateDeveloperEmployee): Promise<DeleteImageResponseDto>;
    remove(id: string, user: RealEstateDeveloperEmployee): Promise<void>;
}
