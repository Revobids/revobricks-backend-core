import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  RealEstateDeveloper,
  RealEstateDeveloperEmployee,
  Office,
  Project,
} from '../../entities';
import {
  CreateRealEstateDeveloperDto,
  UpdateRealEstateDeveloperDto,
} from '../../dto/real-estate-developer.dto';
import { UserRole } from '../../entities/real-estate-developer-employee.entity';

@Injectable()
export class RealEstateDeveloperService {
  constructor(
    @InjectRepository(RealEstateDeveloper)
    private developerRepository: Repository<RealEstateDeveloper>,
    @InjectRepository(RealEstateDeveloperEmployee)
    private employeeRepository: Repository<RealEstateDeveloperEmployee>,
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(
    createDto: CreateRealEstateDeveloperDto,
  ): Promise<RealEstateDeveloper> {
    const {
      name,
      description,
      address,
      phone,
      email,
      ownerUsername,
      ownerPassword,
      ownerEmail,
      ownerName,
    } = createDto;

    const existingDeveloper = await this.developerRepository.findOne({
      where: { name },
    });
    if (existingDeveloper) {
      throw new ConflictException(
        'Real estate developer with this name already exists',
      );
    }

    const existingUser = await this.employeeRepository.findOne({
      where: [{ username: ownerUsername }, { email: ownerEmail }],
    });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
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
      role: UserRole.ADMIN,
      realEstateDeveloperId: developer.id,
      officeId: mainOffice.id,
    });
    await this.employeeRepository.save(owner);

    return developer;
  }

  async findAll(): Promise<RealEstateDeveloper[]> {
    return this.developerRepository.find({
      relations: ['offices', 'employees'],
    });
  }

  async findOne(id: string): Promise<RealEstateDeveloper> {
    const developer = await this.developerRepository.findOne({
      where: { id },
      relations: ['offices', 'employees', 'employees.office'],
    });

    if (!developer) {
      throw new NotFoundException('Real estate developer not found');
    }

    // Get associated projects
    const projects = await this.projectRepository.find({
      where: { realEstateDeveloperId: id },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        state: true,
        status: true,
        projectType: true,
        propertyType: true,
        totalUnits: true,
        expectedCompletionDate: true,
        constructionStartDate: true,
      },
    });

    return {
      ...developer,
      projects,
    } as any;
  }

  async update(
    id: string,
    updateDto: UpdateRealEstateDeveloperDto,
  ): Promise<RealEstateDeveloper> {
    const developer = await this.findOne(id);

    Object.assign(developer, updateDto);
    return this.developerRepository.save(developer);
  }

  async remove(id: string): Promise<void> {
    const developer = await this.findOne(id);
    developer.isActive = false;
    await this.developerRepository.save(developer);
  }
}
