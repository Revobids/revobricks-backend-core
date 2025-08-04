import { BookmarkService } from './bookmark.service';
import { User } from '../../entities/user.entity';
import { Bookmark } from '../../entities/bookmark.entity';
import { Project } from '../../entities/project.entity';
export declare class BookmarkController {
    private readonly bookmarkService;
    constructor(bookmarkService: BookmarkService);
    addBookmark(projectId: string, user: User): Promise<Bookmark>;
    removeBookmark(projectId: string, user: User): Promise<void>;
    getUserBookmarks(user: User): Promise<Project[]>;
    getBookmarkStatus(projectId: string, user: User): Promise<{
        isBookmarked: boolean;
    }>;
}
