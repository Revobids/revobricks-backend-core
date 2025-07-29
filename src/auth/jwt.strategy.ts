import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealEstateDeveloperEmployee } from '../entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(RealEstateDeveloperEmployee)
    private employeeRepository: Repository<RealEstateDeveloperEmployee>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET ||
        'your-super-secret-jwt-key-change-this-in-production',
    });
  }

  async validate(payload: any) {
    const { userId } = payload;
    const employee = await this.employeeRepository.findOne({
      where: { id: userId },
      relations: ['realEstateDeveloper', 'office'],
    });

    if (!employee) {
      throw new UnauthorizedException();
    }

    return employee;
  }
}
