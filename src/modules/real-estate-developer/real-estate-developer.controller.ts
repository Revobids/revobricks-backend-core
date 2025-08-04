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
import { RealEstateDeveloperService } from './real-estate-developer.service';
import {
  CreateRealEstateDeveloperDto,
  UpdateRealEstateDeveloperDto,
} from '../../dto/real-estate-developer.dto';
import { UserJwtAuthGuard } from '../../guards/user-jwt-auth.guard';

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
}
