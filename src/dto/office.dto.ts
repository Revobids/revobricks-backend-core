import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateOfficeDto {
  @ApiProperty({ example: 'Downtown Office' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '456 Business Ave' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'New York' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'NY' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'North East' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ example: '+1987654321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isMainOffice?: boolean;
}

export class UpdateOfficeDto extends PartialType(CreateOfficeDto) {}
