import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RealEstateDeveloperEmployee } from '../entities';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
export declare class AuthService {
    private employeeRepository;
    private jwtService;
    constructor(employeeRepository: Repository<RealEstateDeveloperEmployee>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        employee: any;
    }>;
    validateUser(employeeId: string): Promise<RealEstateDeveloperEmployee>;
}
