import { UserAuthService } from './user-auth.service';
import { FirebaseAuthDto, UpdateUserProfileDto, AuthResponseDto } from '../../dto/user-auth.dto';
export declare class UserAuthController {
    private readonly userAuthService;
    constructor(userAuthService: UserAuthService);
    authenticateWithFirebase(firebaseAuthDto: FirebaseAuthDto): Promise<AuthResponseDto>;
    getProfile(req: any): Promise<import("../../entities").User>;
    updateProfile(req: any, updateUserProfileDto: UpdateUserProfileDto): Promise<import("../../entities").User>;
}
