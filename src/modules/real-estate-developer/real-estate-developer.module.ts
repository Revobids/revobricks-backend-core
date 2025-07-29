import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealEstateDeveloperService } from './real-estate-developer.service';
import { RealEstateDeveloperController } from './real-estate-developer.controller';
import {
  RealEstateDeveloper,
  RealEstateDeveloperEmployee,
  Office,
} from '../../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RealEstateDeveloper,
      RealEstateDeveloperEmployee,
      Office,
    ]),
  ],
  controllers: [RealEstateDeveloperController],
  providers: [RealEstateDeveloperService],
  exports: [RealEstateDeveloperService],
})
export class RealEstateDeveloperModule {}
