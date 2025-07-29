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
      relations: ['offices', 'users'],
    });
  }

  async findOne(id: string): Promise<RealEstateDeveloper> {
    const developer = await this.developerRepository.findOne({
      where: { id },
      relations: ['offices', 'users'],
    });

    if (!developer) {
      throw new NotFoundException('Real estate developer not found');
    }

    return developer;
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
