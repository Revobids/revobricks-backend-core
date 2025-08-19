import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Office } from '../../entities';
import { CreateOfficeDto, UpdateOfficeDto } from '../../dto/office.dto';

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
  ) {}

  async create(
    createOfficeDto: CreateOfficeDto,
    realEstateDeveloperId: string,
  ): Promise<Office> {
    const { isMainOffice } = createOfficeDto;

    if (isMainOffice) {
      const existingMainOffice = await this.officeRepository.findOne({
        where: { realEstateDeveloperId, isMainOffice: true },
      });

      if (existingMainOffice) {
        throw new ConflictException(
          'Main office already exists for this developer',
        );
      }
    }

    const office = this.officeRepository.create({
      ...createOfficeDto,
      realEstateDeveloperId,
    });

    return this.officeRepository.save(office);
  }

  async findAll(realEstateDeveloperId?: string): Promise<Office[]> {
    const where = realEstateDeveloperId ? { realEstateDeveloperId } : {};
    return this.officeRepository.find({
      where,
      relations: ['realEstateDeveloper', 'employees'],
    });
  }

  async findOne(id: string): Promise<Office> {
    const office = await this.officeRepository.findOne({
      where: { id },
      relations: ['realEstateDeveloper', 'employees'],
    });

    if (!office) {
      throw new NotFoundException('Office not found');
    }

    return office;
  }

  async update(id: string, updateOfficeDto: UpdateOfficeDto): Promise<Office> {
    const office = await this.findOne(id);

    if (updateOfficeDto.isMainOffice && !office.isMainOffice) {
      const existingMainOffice = await this.officeRepository.findOne({
        where: {
          realEstateDeveloperId: office.realEstateDeveloperId,
          isMainOffice: true,
        },
      });

      if (existingMainOffice) {
        throw new ConflictException(
          'Main office already exists for this developer',
        );
      }
    }

    Object.assign(office, updateOfficeDto);
    return this.officeRepository.save(office);
  }

  async remove(id: string): Promise<void> {
    const office = await this.findOne(id);

    if (office.isMainOffice) {
      throw new BadRequestException('Cannot delete main office');
    }

    const employeesCount = await this.officeRepository
      .createQueryBuilder('office')
      .leftJoin('office.employees', 'employees')
      .where('office.id = :id', { id })
      .andWhere('employees.isActive = true')
      .getCount();

    if (employeesCount > 0) {
      throw new BadRequestException(
        'Cannot delete office with active employees',
      );
    }

    office.isActive = false;
    await this.officeRepository.save(office);
  }

  async findByDeveloper(developerId: string): Promise<Office[]> {
    return this.officeRepository.find({
      where: { realEstateDeveloperId: developerId },
      relations: ['employees'],
    });
  }

  async getOfficeEmployees(officeId: string, realEstateDeveloperId: string) {
    const office = await this.officeRepository.findOne({
      where: { 
        id: officeId, 
        realEstateDeveloperId,
        isActive: true 
      },
      relations: ['employees'],
    });

    if (!office) {
      throw new NotFoundException('Office not found or not from your organization');
    }

    // Filter only active employees
    const activeEmployees = office.employees.filter(employee => employee.isActive);

    return {
      office: {
        id: office.id,
        name: office.name,
        address: office.address,
        isMainOffice: office.isMainOffice,
      },
      employees: activeEmployees.map(employee => ({
        id: employee.id,
        username: employee.username,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        isActive: employee.isActive,
        createdAt: employee.createdAt,
      })),
      totalEmployees: activeEmployees.length,
    };
  }
}
