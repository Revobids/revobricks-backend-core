import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import awsConfig from './config/aws.config';
import { AuthModule } from './auth/auth.module';
import { RealEstateDeveloperModule } from './modules/real-estate-developer/real-estate-developer.module';
import { OfficeModule } from './modules/office/office.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ProjectModule } from './modules/project/project.module';
import { UserAuthModule } from './modules/user-auth/user-auth.module';
import { BookmarkModule } from './modules/bookmark/bookmark.module';
import { FirebaseModule } from './config/firebase.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [awsConfig],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    FirebaseModule,
    AuthModule,
    RealEstateDeveloperModule,
    OfficeModule,
    EmployeeModule,
    ProjectModule,
    UserAuthModule,
    BookmarkModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
