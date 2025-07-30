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

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL, // For production (Neon.tech)
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'backend_core',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  entities: [
    RealEstateDeveloper,
    RealEstateDeveloperEmployee,
    Office,
    Project,
    ProjectEmployee,
    User,
    Bookmark,
  ],
  synchronize: process.env.NODE_ENV !== 'production', // Only in development
  dropSchema: false,
  logging: process.env.NODE_ENV === 'development',
};
