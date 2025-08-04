import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstateDeveloperEmployee, User } from '../entities';
import { JwtStrategy } from './jwt.strategy';
import { UserJwtStrategy } from './user-jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'your-super-secret-jwt-key-change-this-in-production',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION || '24h',
      },
    }),
    TypeOrmModule.forFeature([RealEstateDeveloperEmployee, User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserJwtStrategy],
  exports: [JwtStrategy, UserJwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
