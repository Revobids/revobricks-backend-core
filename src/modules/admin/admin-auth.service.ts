import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, AuthProvider } from '../../entities/user.entity';
import { Project } from '../../entities/project.entity';
import { FirebaseService } from '../../config/firebase.config';

const ALLOWED_ADMIN_PHONES = ['917006672937', '916282545631'];

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private firebaseService: FirebaseService,
    private jwtService: JwtService,
  ) {}

  async authenticateAdmin(idToken: string) {
    if (!idToken) {
      throw new HttpException('ID token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      // Verify Firebase ID token
      const decodedToken = await this.firebaseService.verifyToken(idToken);
      
      if (!decodedToken) {
        throw new UnauthorizedException('Invalid Firebase ID token');
      }

      const { uid, phone_number } = decodedToken;
      const phoneNumber = phone_number?.replace(/\+/g, '');

      if (!phoneNumber) {
        throw new HttpException('Phone number not found in token', HttpStatus.BAD_REQUEST);
      }

      // Check if phone number is in allowed admin list
      if (!ALLOWED_ADMIN_PHONES.includes(phoneNumber)) {
        throw new HttpException('Unauthorized user', HttpStatus.FORBIDDEN);
      }

      // Find or create user
      let user = await this.userRepository.findOne({
        where: { firebaseUid: uid }
      });

      if (!user) {
        // Create new admin user
        user = this.userRepository.create({
          firebaseUid: uid,
          phoneNumber,
          authProvider: AuthProvider.PHONE,
          isAdmin: true
        });
        await this.userRepository.save(user);
      } else {
        // Update existing user to admin
        user.isAdmin = true;
        await this.userRepository.save(user);
      }

      // Generate JWT token
      const payload = {
        sub: user.id,  // Standard JWT subject field expected by UserJwtStrategy
        userId: user.id,
        firebaseUid: user.firebaseUid,
        phoneNumber: user.phoneNumber,
        isAdmin: true
      };

      console.log('Admin token payload:', payload);
      console.log('Generated admin user:', { id: user.id, phoneNumber: user.phoneNumber, isAdmin: user.isAdmin, isActive: user.isActive });
      
      const token = this.jwtService.sign(payload);

      return {
        success: true,
        token,
        admin: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          isAdmin: true,
          firebaseUid: user.firebaseUid,
          authProvider: user.authProvider,
          isActive: user.isActive,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        }
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Authentication failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.find({
        where: { isActive: true },
        select: ['id', 'name', 'email', 'phoneNumber', 'authProvider', 'isAdmin', 'createdAt', 'updatedAt']
      });
      return users;
    } catch (error) {
      throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllProjects() {
    try {
      const projects = await this.projectRepository.find({
        relations: ['realEstateDeveloper', 'projectManager', 'salesManager'],
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          city: true,
          state: true,
          status: true,
          projectType: true,
          propertyType: true,
          totalUnits: true,
          expectedCompletionDate: true,
          constructionStartDate: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return projects;
    } catch (error) {
      throw new HttpException('Failed to fetch projects', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}