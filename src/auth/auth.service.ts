import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RealEstateDeveloperEmployee } from '../entities';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RealEstateDeveloperEmployee)
    private employeeRepository: Repository<RealEstateDeveloperEmployee>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
    const {
      username,
      password,
      email,
      name,
      role,
      realEstateDeveloperId,
      officeId,
      employeeId,
    } = registerDto;

    const existingEmployee = await this.employeeRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingEmployee) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = this.employeeRepository.create({
      username,
      password: hashedPassword,
      email,
      name,
      role,
      realEstateDeveloperId,
      officeId,
      employeeId,
    });

    await this.employeeRepository.save(employee);

    const payload = {
      userId: employee.id,
      username: employee.username,
      role: employee.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; employee: any }> {
    const { username, password } = loginDto;

    const employee = await this.employeeRepository.findOne({
      where: { username },
      relations: ['realEstateDeveloper', 'office'],
    });

    if (!employee || !(await bcrypt.compare(password, employee.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: employee.id,
      username: employee.username,
      role: employee.role,
    };
    const accessToken = this.jwtService.sign(payload);

    const { password: _, ...employeeWithoutPassword } = employee;

    return { accessToken, employee: employeeWithoutPassword };
  }

  async validateUser(employeeId: string): Promise<RealEstateDeveloperEmployee> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
      relations: ['realEstateDeveloper', 'office'],
    });

    if (!employee) {
      throw new UnauthorizedException();
    }

    return employee;
  }
}
