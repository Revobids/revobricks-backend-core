import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  ChangePasswordDto,
} from '../../dto/employee.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { GetUser } from '../../decorators/get-user.decorator';
import { UserRole } from '../../entities/real-estate-developer-employee.entity';
import { RealEstateDeveloperEmployee } from '../../entities';

@ApiTags('Employees')
@Controller('employees')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: 201, description: 'Employee successfully created' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  create(
    @Body(ValidationPipe) createEmployeeDto: CreateEmployeeDto,
    @GetUser() currentEmployee: RealEstateDeveloperEmployee,
  ) {
    return this.employeeService.create(createEmployeeDto, currentEmployee);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({ status: 200, description: 'List of all employees' })
  findAll(@GetUser() currentEmployee: RealEstateDeveloperEmployee) {
    return this.employeeService.findAll(currentEmployee);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a employee by id' })
  @ApiResponse({ status: 200, description: 'Employee found' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  findOne(
    @Param('id') id: string,
    @GetUser() currentEmployee: RealEstateDeveloperEmployee,
  ) {
    return this.employeeService.findOne(id, currentEmployee);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update a employee' })
  @ApiResponse({ status: 200, description: 'Employee successfully updated' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateEmployeeDto,
    @GetUser() currentEmployee: RealEstateDeveloperEmployee,
  ) {
    return this.employeeService.update(id, updateUserDto, currentEmployee);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete a employee' })
  @ApiResponse({ status: 200, description: 'Employee successfully deleted' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 403, description: 'Cannot delete your own account' })
  remove(
    @Param('id') id: string,
    @GetUser() currentEmployee: RealEstateDeveloperEmployee,
  ) {
    return this.employeeService.remove(id, currentEmployee);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password successfully changed' })
  @ApiResponse({ status: 403, description: 'Invalid old password' })
  changePassword(
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
    @GetUser() currentEmployee: RealEstateDeveloperEmployee,
  ) {
    return this.employeeService.changePassword(
      currentEmployee.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}
