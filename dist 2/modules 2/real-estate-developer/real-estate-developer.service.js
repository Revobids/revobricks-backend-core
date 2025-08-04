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
exports.RealEstateDeveloperService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const entities_1 = require("../../entities");
const real_estate_developer_employee_entity_1 = require("../../entities/real-estate-developer-employee.entity");
let RealEstateDeveloperService = class RealEstateDeveloperService {
    developerRepository;
    employeeRepository;
    officeRepository;
    constructor(developerRepository, employeeRepository, officeRepository) {
        this.developerRepository = developerRepository;
        this.employeeRepository = employeeRepository;
        this.officeRepository = officeRepository;
    }
    async create(createDto) {
        const { name, description, address, phone, email, ownerUsername, ownerPassword, ownerEmail, ownerName, } = createDto;
        const existingDeveloper = await this.developerRepository.findOne({
            where: { name },
        });
        if (existingDeveloper) {
            throw new common_1.ConflictException('Real estate developer with this name already exists');
        }
        const existingUser = await this.employeeRepository.findOne({
            where: [{ username: ownerUsername }, { email: ownerEmail }],
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username or email already exists');
        }
        const developer = this.developerRepository.create({
            name,
            description,
            address,
            phone,
            email,
        });
        await this.developerRepository.save(developer);
        const mainOffice = this.officeRepository.create({
            name: `${name} - Main Office`,
            address,
            isMainOffice: true,
            realEstateDeveloperId: developer.id,
        });
        await this.officeRepository.save(mainOffice);
        const hashedPassword = await bcrypt.hash(ownerPassword, 10);
        const owner = this.employeeRepository.create({
            username: ownerUsername,
            password: hashedPassword,
            email: ownerEmail,
            name: ownerName,
            role: real_estate_developer_employee_entity_1.UserRole.ADMIN,
            realEstateDeveloperId: developer.id,
            officeId: mainOffice.id,
        });
        await this.employeeRepository.save(owner);
        return developer;
    }
    async findAll() {
        return this.developerRepository.find({
            relations: ['offices', 'users'],
        });
    }
    async findOne(id) {
        const developer = await this.developerRepository.findOne({
            where: { id },
            relations: ['offices', 'users'],
        });
        if (!developer) {
            throw new common_1.NotFoundException('Real estate developer not found');
        }
        return developer;
    }
    async update(id, updateDto) {
        const developer = await this.findOne(id);
        Object.assign(developer, updateDto);
        return this.developerRepository.save(developer);
    }
    async remove(id) {
        const developer = await this.findOne(id);
        developer.isActive = false;
        await this.developerRepository.save(developer);
    }
};
exports.RealEstateDeveloperService = RealEstateDeveloperService;
exports.RealEstateDeveloperService = RealEstateDeveloperService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.RealEstateDeveloper)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.RealEstateDeveloperEmployee)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Office)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RealEstateDeveloperService);
//# sourceMappingURL=real-estate-developer.service.js.map