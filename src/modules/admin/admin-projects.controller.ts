import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { UserJwtAuthGuard } from '../../guards/user-jwt-auth.guard';

@ApiTags('admin-projects')
@Controller('projects')
export class AdminProjectsController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Get()
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get all projects (Admin only)',
    description: 'Retrieve all projects in the system. Only accessible by authenticated admins.'
  })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllProjects() {
    return await this.adminAuthService.getAllProjects();
  }
}