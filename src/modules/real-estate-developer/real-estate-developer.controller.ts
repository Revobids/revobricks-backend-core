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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RealEstateDeveloperService } from './real-estate-developer.service';
import {
  CreateRealEstateDeveloperDto,
  UpdateRealEstateDeveloperDto,
} from '../../dto/real-estate-developer.dto';
import { UserJwtAuthGuard } from '../../guards/user-jwt-auth.guard';
import { UploadLogoResponseDto } from './dto/upload-logo.dto';

@ApiTags('Real Estate Developers')
@Controller('real-estate-developers')
export class RealEstateDeveloperController {
  constructor(private readonly developerService: RealEstateDeveloperService) {}

  @Post()
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new real estate developer' })
  @ApiResponse({ status: 201, description: 'Developer successfully created' })
  @ApiResponse({ status: 409, description: 'Developer already exists' })
  create(@Body(ValidationPipe) createDto: CreateRealEstateDeveloperDto) {
    return this.developerService.create(createDto);
  }

  @Get()
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all real estate developers' })
  @ApiResponse({ status: 200, description: 'List of all developers' })
  findAll() {
    return this.developerService.findAll();
  }

  @Get(':id')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a real estate developer by id' })
  @ApiResponse({ status: 200, description: 'Developer found' })
  @ApiResponse({ status: 404, description: 'Developer not found' })
  findOne(@Param('id') id: string) {
    return this.developerService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a real estate developer' })
  @ApiResponse({ status: 200, description: 'Developer successfully updated' })
  @ApiResponse({ status: 404, description: 'Developer not found' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDto: UpdateRealEstateDeveloperDto,
  ) {
    return this.developerService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a real estate developer' })
  @ApiResponse({ status: 200, description: 'Developer successfully deleted' })
  @ApiResponse({ status: 404, description: 'Developer not found' })
  remove(@Param('id') id: string) {
    return this.developerService.remove(id);
  }

  @Post(':id/upload-logo')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload logo for a real estate developer' })
  @ApiBody({
    description: 'Logo image file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
          description: 'Logo image file (JPEG, PNG, GIF, WebP)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Logo uploaded successfully',
    type: UploadLogoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid file or missing file' })
  @ApiResponse({ status: 404, description: 'Developer not found' })
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadLogoResponseDto> {
    if (!file) {
      throw new BadRequestException('Logo file is required');
    }

    // Validate file type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed',
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    return this.developerService.uploadLogo(id, file);
  }
}
