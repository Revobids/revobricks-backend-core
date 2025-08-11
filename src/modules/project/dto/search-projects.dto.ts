import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchProjectsDto {
  @ApiPropertyOptional({
    description: 'Search query for project name, location, or developer name',
    example: 'mumbai luxury apartment',
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({
    description: 'Location search (city, state, or area)',
    example: 'mumbai',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Developer name search',
    example: 'godrej properties',
  })
  @IsOptional()
  @IsString()
  developer?: string;

  @ApiPropertyOptional({
    description: 'Fuzzy search threshold (0-1, lower = more fuzzy)',
    example: 0.3,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number = 0.3;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}