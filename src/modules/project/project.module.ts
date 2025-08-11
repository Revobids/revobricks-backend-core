import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PublicProjectController } from './public-project.controller';
import { Project } from '../../entities/project.entity';
import { ProjectEmployee } from '../../entities/project-employee.entity';
import { RealEstateDeveloperEmployee } from '../../entities/real-estate-developer-employee.entity';
import { Bookmark } from '../../entities/bookmark.entity';
import { ServicesModule } from '../../services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectEmployee,
      RealEstateDeveloperEmployee,
      Bookmark,
    ]),
    ServicesModule,
  ],
  controllers: [ProjectController, PublicProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
