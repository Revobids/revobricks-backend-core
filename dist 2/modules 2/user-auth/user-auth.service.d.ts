import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { FirebaseService } from '../../config/firebase.config';
import { FirebaseAuthDto, UpdateUserProfileDto, AuthResponseDto } from '../../dto/user-auth.dto';
export declare class UserAuthService {
    private userRepository;
    private firebaseService;
    private jwtService;
    constructor(userRepository: Repository<User>, firebaseService: FirebaseService, jwtService: JwtService);
    authenticateWithFirebase(firebaseAuthDto: FirebaseAuthDto): Promise<AuthResponseDto>;
    getProfile(userId: string): Promise<User>;
    updateProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto): Promise<User>;
    validateUser(userId: string): Promise<User>;
}
