export declare class FirebaseAuthDto {
    idToken: string;
}
export declare class UpdateUserProfileDto {
    name?: string;
    age?: number;
}
export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: string;
        name?: string;
        email?: string;
        phoneNumber?: string;
        age?: number;
        authProvider: string;
        createdAt: Date;
        updatedAt: Date;
    };
}
