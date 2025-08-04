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
exports.OfficeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let OfficeService = class OfficeService {
    officeRepository;
    constructor(officeRepository) {
        this.officeRepository = officeRepository;
    }
    async create(createOfficeDto, realEstateDeveloperId) {
        const { isMainOffice } = createOfficeDto;
        if (isMainOffice) {
            const existingMainOffice = await this.officeRepository.findOne({
                where: { realEstateDeveloperId, isMainOffice: true },
            });
            if (existingMainOffice) {
                throw new common_1.ConflictException('Main office already exists for this developer');
            }
        }
        const office = this.officeRepository.create({
            ...createOfficeDto,
            realEstateDeveloperId,
        });
        return this.officeRepository.save(office);
    }
    async findAll(realEstateDeveloperId) {
        const where = realEstateDeveloperId ? { realEstateDeveloperId } : {};
        return this.officeRepository.find({
            where,
            relations: ['realEstateDeveloper', 'employees'],
        });
    }
    async findOne(id) {
        const office = await this.officeRepository.findOne({
            where: { id },
            relations: ['realEstateDeveloper', 'employees'],
        });
        if (!office) {
            throw new common_1.NotFoundException('Office not found');
        }
        return office;
    }
    async update(id, updateOfficeDto) {
        const office = await this.findOne(id);
        if (updateOfficeDto.isMainOffice && !office.isMainOffice) {
            const existingMainOffice = await this.officeRepository.findOne({
                where: {
                    realEstateDeveloperId: office.realEstateDeveloperId,
                    isMainOffice: true,
                },
            });
            if (existingMainOffice) {
                throw new common_1.ConflictException('Main office already exists for this developer');
            }
        }
        Object.assign(office, updateOfficeDto);
        return this.officeRepository.save(office);
    }
    async remove(id) {
        const office = await this.findOne(id);
        if (office.isMainOffice) {
            throw new common_1.BadRequestException('Cannot delete main office');
        }
        const employeesCount = await this.officeRepository
            .createQueryBuilder('office')
            .leftJoin('office.employees', 'employees')
            .where('office.id = :id', { id })
            .andWhere('employees.isActive = true')
            .getCount();
        if (employeesCount > 0) {
            throw new common_1.BadRequestException('Cannot delete office with active employees');
        }
        office.isActive = false;
        await this.officeRepository.save(office);
    }
    async findByDeveloper(developerId) {
        return this.officeRepository.find({
            where: { realEstateDeveloperId: developerId },
            relations: ['employees'],
        });
    }
};
exports.OfficeService = OfficeService;
exports.OfficeService = OfficeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Office)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OfficeService);
//# sourceMappingURL=office.service.js.map