import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { User } from '../../entities/user.entity';
import { UserJwtStrategy } from '../../auth/user-jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'user-jwt' }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION || '24h',
      },
    }),
  ],
  controllers: [UserAuthController],
  providers: [UserAuthService, UserJwtStrategy],
  exports: [UserAuthService, UserJwtStrategy, PassportModule],
})
export class UserAuthModule {}