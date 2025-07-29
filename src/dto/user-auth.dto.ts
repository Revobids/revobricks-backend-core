import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FirebaseAuthDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Firebase ID token from client authentication (phone OTP or Google)'
  })
  @IsString()
  idToken: string;
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ example: 'John Doe Updated' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 26 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: {
    id: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    age?: number;
    authProvider: string;
    createdAt: Date;
    updatedAt: Date;
  };
}