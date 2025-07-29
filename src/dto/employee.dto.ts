import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { UserRole } from '../entities/real-estate-developer-employee.entity';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'jane.smith' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Jane Smith' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.SALES_EXECUTIVE })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  officeId: string;

  @ApiPropertyOptional({ example: 'EMP002' })
  @IsOptional()
  @IsString()
  employeeId?: string;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'newPassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
