import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstateDeveloperService } from './real-estate-developer.service';
import { RealEstateDeveloperController } from './real-estate-developer.controller';
import {
  RealEstateDeveloper,
  RealEstateDeveloperEmployee,
  Office,
  Project,
} from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RealEstateDeveloper,
      RealEstateDeveloperEmployee,
      Office,
      Project,
    ]),
  ],
  controllers: [RealEstateDeveloperController],
  providers: [RealEstateDeveloperService],
  exports: [RealEstateDeveloperService],
})
export class RealEstateDeveloperModule {}
