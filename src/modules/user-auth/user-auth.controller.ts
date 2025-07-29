import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserAuthService } from './user-auth.service';
import {
  FirebaseAuthDto,
  UpdateUserProfileDto,
  AuthResponseDto,
} from '../../dto/user-auth.dto';
import { UserJwtAuthGuard } from '../../guards/user-jwt-auth.guard';

@ApiTags('User Authentication')
@Controller('auth/users')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('authenticate')
  @ApiOperation({ 
    summary: 'Authenticate with Firebase ID token (Phone OTP or Google)',
    description: 'Send Firebase ID token from client. Works for both phone OTP and Google authentication. Creates account if user doesn\'t exist.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User authenticated successfully',
    type: AuthResponseDto
  })
  @ApiResponse({ status: 401, description: 'Invalid Firebase ID token' })
  @ApiResponse({ status: 400, description: 'Authentication failed' })
  async authenticateWithFirebase(
    @Body(ValidationPipe) firebaseAuthDto: FirebaseAuthDto,
  ): Promise<AuthResponseDto> {
    return this.userAuthService.authenticateWithFirebase(firebaseAuthDto);
  }

  @Get('profile')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: any) {
    return this.userAuthService.getProfile(req.user.id);
  }

  @Put('profile')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @Req() req: any,
    @Body(ValidationPipe) updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userAuthService.updateProfile(req.user.id, updateUserProfileDto);
  }
}