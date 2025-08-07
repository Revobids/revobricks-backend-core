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
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RealEstateDeveloper,
      RealEstateDeveloperEmployee,
      Office,
      Project,
    ]),
    ServicesModule,
  ],
  controllers: [RealEstateDeveloperController],
  providers: [RealEstateDeveloperService],
  exports: [RealEstateDeveloperService],
})
export class RealEstateDeveloperModule {}
