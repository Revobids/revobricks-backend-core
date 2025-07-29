import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
  IsDateString,
  IsUUID,
  IsNotEmpty,
  ValidateNested,
  IsUrl,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectType, PropertyType } from '../../../entities/project.entity';

class ApprovalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authority: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  approvalNumber: string;

  @ApiProperty()
  @IsDateString()
  approvalDate: Date;
}

class FloorPlanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  area: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  areaUnit: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  bedrooms: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  bathrooms: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;
}

class ImageDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  caption: string;
}

class BrochureDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pincode: string;

  @ApiProperty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ enum: ProjectType })
  @IsEnum(ProjectType)
  projectType: ProjectType;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  totalUnits: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalArea: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  areaUnit: string;

  @ApiProperty()
  @IsDateString()
  expectedCompletionDate: Date;

  @ApiProperty()
  @IsDateString()
  constructionStartDate: Date;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  amenities: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  amenitiesDescription?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reraNumber?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  reraApprovalDate?: Date;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  reraWebsite?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  legalDetails?: string;

  @ApiPropertyOptional({ type: [ApprovalDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApprovalDto)
  @IsOptional()
  approvals?: ApprovalDto[];

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ type: [FloorPlanDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FloorPlanDto)
  @IsOptional()
  floorPlans?: FloorPlanDto[];

  @ApiPropertyOptional({ type: [ImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @IsOptional()
  images?: ImageDto[];

  @ApiPropertyOptional({ type: [BrochureDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BrochureDto)
  @IsOptional()
  brochures?: BrochureDto[];

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  projectManagerId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  salesManagerId: string;
}
