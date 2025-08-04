import { ProjectService } from './project.service';
import { Project } from '../../entities/project.entity';
import { GetProjectsDto } from './dto/get-projects.dto';
import { User } from '../../entities/user.entity';
export declare class PublicProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    getProjects(query: GetProjectsDto): Promise<Project[]>;
    getProject(id: string): Promise<Project>;
    getProjectWithBookmark(id: string, user: User): Promise<Project & {
        isBookmarked: boolean;
    }>;
}
