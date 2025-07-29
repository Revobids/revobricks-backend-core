import { IsUUID, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectRole } from '../../../entities/project-employee.entity';

export class AssignEmployeeDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty({ enum: ProjectRole })
  @IsEnum(ProjectRole)
  role: ProjectRole;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  assignedDate?: Date;
}
