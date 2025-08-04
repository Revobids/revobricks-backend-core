import { Controller, Post, Body, ValidationPipe, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { FirebaseAuthDto, AuthResponseDto } from '../../dto/user-auth.dto';
import { UserJwtAuthGuard } from '../../guards/user-jwt-auth.guard';

@ApiTags('admin-auth')
@Controller('admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('auth/authenticate')
  @ApiOperation({ 
    summary: 'Authenticate admin with Firebase ID token',
    description: 'Send Firebase ID token from client. Only allowed phone numbers can authenticate as admin.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Admin authenticated successfully',
    type: AuthResponseDto
  })
  @ApiResponse({ status: 401, description: 'Invalid Firebase ID token' })
  @ApiResponse({ status: 403, description: 'Unauthorized user - phone number not in admin list' })
  async authenticateAdmin(
    @Body(ValidationPipe) firebaseAuthDto: FirebaseAuthDto,
  ) {
    return await this.adminAuthService.authenticateAdmin(firebaseAuthDto.idToken);
  }

}