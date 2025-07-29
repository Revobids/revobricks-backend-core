import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ProjectStatus } from '../../../entities/project.entity';

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['projectManagerId', 'salesManagerId'] as const),
) {
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}
