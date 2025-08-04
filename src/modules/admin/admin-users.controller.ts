import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { UserJwtAuthGuard } from '../../guards/user-jwt-auth.guard';

@ApiTags('admin-users')
@Controller('users')
export class AdminUsersController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Get()
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get all users (Admin only)',
    description: 'Retrieve all users in the system. Only accessible by authenticated admins.'
  })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllUsers() {
    return await this.adminAuthService.getAllUsers();
  }
}