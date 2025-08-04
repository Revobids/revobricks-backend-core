import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    });
  }

  async validate(payload: any) {
    console.log('UserJwtStrategy - validating payload:', payload);
    const { sub: userId } = payload;
    console.log('UserJwtStrategy - looking for user with id:', userId);
    
    const user = await this.userRepository.findOne({
      where: { id: userId, isActive: true },
    });

    console.log('UserJwtStrategy - found user:', user ? { id: user.id, isAdmin: user.isAdmin, isActive: user.isActive } : 'null');

    if (!user) {
      console.log('UserJwtStrategy - user not found, throwing UnauthorizedException');
      throw new UnauthorizedException();
    }

    return user;
  }
}