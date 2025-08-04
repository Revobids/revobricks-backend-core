"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const entities_1 = require("../entities");
let AuthService = class AuthService {
    employeeRepository;
    jwtService;
    constructor(employeeRepository, jwtService) {
        this.employeeRepository = employeeRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { username, password, email, name, role, realEstateDeveloperId, officeId, employeeId, } = registerDto;
        const existingEmployee = await this.employeeRepository.findOne({
            where: [{ username }, { email }],
        });
        if (existingEmployee) {
            throw new common_1.ConflictException('Username or email already exists');
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
    async login(loginDto) {
        const { username, password } = loginDto;
        const employee = await this.employeeRepository.findOne({
            where: { username },
            relations: ['realEstateDeveloper', 'office'],
        });
        if (!employee || !(await bcrypt.compare(password, employee.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async validateUser(employeeId) {
        const employee = await this.employeeRepository.findOne({
            where: { id: employeeId },
            relations: ['realEstateDeveloper', 'office'],
        });
        if (!employee) {
            throw new common_1.UnauthorizedException();
        }
        return employee;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.RealEstateDeveloperEmployee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map