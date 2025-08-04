import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminAuthController } from './admin-auth.controller';
import { AdminUsersController } from './admin-users.controller';
import { AdminProjectsController } from './admin-projects.controller';
import { AdminAuthService } from './admin-auth.service';
import { User } from '../../entities/user.entity';
import { Project } from '../../entities/project.entity';
import { FirebaseModule } from '../../config/firebase.module';
import { UserJwtStrategy } from '../../auth/user-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project]),
    PassportModule.register({ defaultStrategy: 'user-jwt' }),
    FirebaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-change-this-in-production',
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminAuthController, AdminUsersController, AdminProjectsController],
  providers: [AdminAuthService, UserJwtStrategy],
  exports: [AdminAuthService],
})
export class AdminModule {}