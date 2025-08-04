import { Bookmark } from './bookmark.entity';
export declare enum AuthProvider {
    PHONE = "phone",
    GOOGLE = "google"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    age: number;
    authProvider: AuthProvider;
    firebaseUid: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    bookmarks: Bookmark[];
}
