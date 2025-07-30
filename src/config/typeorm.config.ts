import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  RealEstateDeveloper,
  RealEstateDeveloperEmployee,
  Office,
  Project,
  ProjectEmployee,
  User,
  Bookmark,
} from '../entities';

export const typeOrmConfig: TypeOrmModuleOptions = process.env.DATABASE_URL ? {
  // Neon.tech configuration (following official documentation)
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true, // Neon.tech recommendation
  entities: [
    RealEstateDeveloper,
    RealEstateDeveloperEmployee,
    Office,
    Project,
    ProjectEmployee,
    User,
    Bookmark,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  dropSchema: false,
  logging: process.env.NODE_ENV === 'development',
} : {
  // Local development configuration
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
    Bookmark,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  dropSchema: false,
  logging: process.env.NODE_ENV === 'development',
};
