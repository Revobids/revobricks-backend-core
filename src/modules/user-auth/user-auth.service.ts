import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, AuthProvider } from '../../entities/user.entity';
import { FirebaseService } from '../../config/firebase.config';
import { 
  FirebaseAuthDto, 
  UpdateUserProfileDto,
  AuthResponseDto 
} from '../../dto/user-auth.dto';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private firebaseService: FirebaseService,
    private jwtService: JwtService,
  ) {}

  async authenticateWithFirebase(firebaseAuthDto: FirebaseAuthDto): Promise<AuthResponseDto> {
    const { idToken } = firebaseAuthDto;

    try {
      console.log('Received authentication request with token length:', idToken?.length);
      
      // Verify Firebase ID token
      const decodedToken = await this.firebaseService.verifyToken(idToken);
      
      if (!decodedToken) {
        console.error('Token verification failed - decodedToken is null');
        throw new UnauthorizedException('Invalid Firebase ID token');
      }

      const { uid, email, name: firebaseName, phone_number } = decodedToken;

      // Determine auth provider based on Firebase token data
      let authProvider: AuthProvider;
      if (email && decodedToken.firebase?.sign_in_provider === 'google.com') {
        authProvider = AuthProvider.GOOGLE;
      } else if (phone_number || decodedToken.firebase?.sign_in_provider === 'phone') {
        authProvider = AuthProvider.PHONE;
      } else {
        // Default to phone if we can't determine
        authProvider = AuthProvider.PHONE;
      }

      // Create or find user by Firebase UID
      let user = await this.userRepository.findOne({
        where: { firebaseUid: uid }
      });

      if (!user) {
        // Create new user
        const userData: DeepPartial<User> = {
          email: email || undefined,
          phoneNumber: phone_number || undefined,
          name: firebaseName || undefined,
          authProvider,
          firebaseUid: uid,
        };
        
        user = this.userRepository.create(userData);

        user = await this.userRepository.save(user);
        console.log('Created new user:', user.id);
      } else {
        // Update existing user only with data from Firebase token
        let updated = false;
        
        // Update email/phone if they weren't set before
        if (email && !user.email) {
          user.email = email;
          updated = true;
        }
        
        if (phone_number && !user.phoneNumber) {
          user.phoneNumber = phone_number;
          updated = true;
        }

        if (updated) {
          user = await this.userRepository.save(user);
          console.log('Updated existing user:', user.id);
        }
      }

      // Create JWT payload
      const payload = {
        sub: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        authProvider: user.authProvider,
        firebaseUid: user.firebaseUid,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          age: user.age,
          authProvider: user.authProvider,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Firebase authentication error:', error);
      throw new BadRequestException('Authentication failed');
    }
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateUserProfileDto: UpdateUserProfileDto): Promise<User> {
    const user = await this.getProfile(userId);

    Object.assign(user, updateUserProfileDto);
    return this.userRepository.save(user);
  }

  async validateUser(userId: string): Promise<User> {
    return this.getProfile(userId);
  }
}