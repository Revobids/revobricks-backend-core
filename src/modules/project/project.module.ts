import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PublicProjectController } from './public-project.controller';
import { Project } from '../../entities/project.entity';
import { ProjectEmployee } from '../../entities/project-employee.entity';
import { RealEstateDeveloperEmployee } from '../../entities/real-estate-developer-employee.entity';
import { Bookmark } from '../../entities/bookmark.entity';
import { S3Service } from '../../services/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectEmployee,
      RealEstateDeveloperEmployee,
      Bookmark,
    ]),
  ],
  controllers: [ProjectController, PublicProjectController],
  providers: [ProjectService, S3Service],
  exports: [ProjectService],
})
export class ProjectModule {}
