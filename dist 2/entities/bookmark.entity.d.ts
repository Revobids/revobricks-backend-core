import { User } from './user.entity';
import { Project } from './project.entity';
export declare class Bookmark {
    id: string;
    user: User;
    project: Project;
    createdAt: Date;
}
