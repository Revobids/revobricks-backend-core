import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  RealEstateDeveloper,
  RealEstateDeveloperEmployee,
  Office,
  Project,
  ProjectEmployee,
  User,
} from '../entities';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'backend_core',
  entities: [
    RealEstateDeveloper,
    RealEstateDeveloperEmployee,
    Office,
    Project,
    ProjectEmployee,
    User,
  ],
  synchronize: true,
  dropSchema: false, // Set to true only if you want to drop all data
  logging: process.env.NODE_ENV === 'development',
};
