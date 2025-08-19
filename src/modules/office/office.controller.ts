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
import { OfficeService } from './office.service';
import { CreateOfficeDto, UpdateOfficeDto } from '../../dto/office.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { GetUser } from '../../decorators/get-user.decorator';
import { UserRole } from '../../entities/real-estate-developer-employee.entity';
import { RealEstateDeveloperEmployee } from '../../entities';

@ApiTags('Offices')
@Controller('offices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new office' })
  @ApiResponse({ status: 201, description: 'Office successfully created' })
  @ApiResponse({ status: 409, description: 'Main office already exists' })
  create(
    @Body(ValidationPipe) createOfficeDto: CreateOfficeDto,
    @GetUser() user: RealEstateDeveloperEmployee,
  ) {
    return this.officeService.create(
      createOfficeDto,
      user.realEstateDeveloperId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all offices' })
  @ApiResponse({ status: 200, description: 'List of all offices' })
  findAll(@GetUser() user: RealEstateDeveloperEmployee) {
    return this.officeService.findAll(user.realEstateDeveloperId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an office by id' })
  @ApiResponse({ status: 200, description: 'Office found' })
  @ApiResponse({ status: 404, description: 'Office not found' })
  findOne(@Param('id') id: string) {
    return this.officeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update an office' })
  @ApiResponse({ status: 200, description: 'Office successfully updated' })
  @ApiResponse({ status: 404, description: 'Office not found' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateOfficeDto: UpdateOfficeDto,
  ) {
    return this.officeService.update(id, updateOfficeDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete an office' })
  @ApiResponse({ status: 200, description: 'Office successfully deleted' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete main office or office with active users',
  })
  @ApiResponse({ status: 404, description: 'Office not found' })
  remove(@Param('id') id: string) {
    return this.officeService.remove(id);
  }

  @Get(':id/employees')
  @ApiOperation({ summary: 'Get all employees of a specific office' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of employees in the office',
    schema: {
      type: 'object',
      properties: {
        office: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            address: { type: 'string' },
            isMainOffice: { type: 'boolean' }
          }
        },
        employees: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              username: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              isActive: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        totalEmployees: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Office not found or not from your organization' })
  getOfficeEmployees(
    @Param('id') id: string,
    @GetUser() user: RealEstateDeveloperEmployee,
  ) {
    return this.officeService.getOfficeEmployees(id, user.realEstateDeveloperId);
  }
}
