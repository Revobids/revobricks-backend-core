import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RealEstateDeveloperEmployee } from '../../entities';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../dto/employee.dto';
import { UserRole } from '../../entities/real-estate-developer-employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(RealEstateDeveloperEmployee)
    private employeeRepository: Repository<RealEstateDeveloperEmployee>,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    currentEmployee: RealEstateDeveloperEmployee,
  ): Promise<RealEstateDeveloperEmployee> {
    const { username, password, email, name, role, officeId, employeeId } =
      createEmployeeDto;

    if (role === UserRole.ADMIN && currentEmployee.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only owners can create other owners');
    }

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
      officeId,
      employeeId,
      realEstateDeveloperId: currentEmployee.realEstateDeveloperId,
    });

    const savedEmployee = await this.employeeRepository.save(employee);
    const { password: _, ...employeeWithoutPassword } = savedEmployee;
    return employeeWithoutPassword as RealEstateDeveloperEmployee;
  }

  async findAll(
    currentEmployee: RealEstateDeveloperEmployee,
  ): Promise<RealEstateDeveloperEmployee[]> {
    const employees = await this.employeeRepository.find({
      where: { realEstateDeveloperId: currentEmployee.realEstateDeveloperId },
      relations: ['office'],
      select: [
        'id',
        'username',
        'name',
        'email',
        'role',
        'employeeId',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });

    return employees;
  }

  async findOne(
    id: string,
    currentEmployee: RealEstateDeveloperEmployee,
  ): Promise<RealEstateDeveloperEmployee> {
    const employee = await this.employeeRepository.findOne({
      where: {
        id,
        realEstateDeveloperId: currentEmployee.realEstateDeveloperId,
      },
      relations: ['office', 'realEstateDeveloper'],
      select: [
        'id',
        'username',
        'name',
        'email',
        'role',
        'employeeId',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
    currentEmployee: RealEstateDeveloperEmployee,
  ): Promise<RealEstateDeveloperEmployee> {
    const employee = await this.employeeRepository.findOne({
      where: {
        id,
        realEstateDeveloperId: currentEmployee.realEstateDeveloperId,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (
      updateEmployeeDto.role === UserRole.ADMIN &&
      currentEmployee.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('Only owners can assign owner role');
    }

    if (updateEmployeeDto.password) {
      updateEmployeeDto.password = await bcrypt.hash(
        updateEmployeeDto.password,
        10,
      );
    }

    Object.assign(employee, updateEmployeeDto);
    const savedEmployee = await this.employeeRepository.save(employee);
    const { password: _, ...employeeWithoutPassword } = savedEmployee;
    return employeeWithoutPassword as RealEstateDeveloperEmployee;
  }

  async remove(
    id: string,
    currentEmployee: RealEstateDeveloperEmployee,
  ): Promise<void> {
    const employee = await this.findOne(id, currentEmployee);

    if (employee.id === currentEmployee.id) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    employee.isActive = false;
    await this.employeeRepository.save(employee);
  }

  async changePassword(
    employeeId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      employee.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid old password');
    }

    employee.password = await bcrypt.hash(newPassword, 10);
    await this.employeeRepository.save(employee);
  }
}
