import * as admin from 'firebase-admin';
export declare class FirebaseService {
    private app;
    constructor();
    createUser(email: string, password: string, displayName: string): Promise<string | null>;
    updateUser(uid: string, updates: any): Promise<void>;
    deleteUser(uid: string): Promise<void>;
    verifyToken(token: string): Promise<admin.auth.DecodedIdToken | null>;
}
