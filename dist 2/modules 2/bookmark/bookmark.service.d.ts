import { Repository } from 'typeorm';
import { Bookmark } from '../../entities/bookmark.entity';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';
export declare class BookmarkService {
    private bookmarkRepository;
    private projectRepository;
    private userRepository;
    constructor(bookmarkRepository: Repository<Bookmark>, projectRepository: Repository<Project>, userRepository: Repository<User>);
    addBookmark(userId: string, projectId: string): Promise<Bookmark>;
    removeBookmark(userId: string, projectId: string): Promise<void>;
    getUserBookmarks(userId: string): Promise<Project[]>;
    isProjectBookmarked(userId: string, projectId: string): Promise<boolean>;
}
