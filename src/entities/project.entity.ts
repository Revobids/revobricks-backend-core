import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { RealEstateDeveloper } from './real-estate-developer.entity';
import { RealEstateDeveloperEmployee } from './real-estate-developer-employee.entity';
import { ProjectEmployee } from './project-employee.entity';
import { Bookmark } from './bookmark.entity';

export enum ProjectStatus {
  UNPUBLISHED = 'UNPUBLISHED',
  PUBLISHED = 'PUBLISHED',
}

export enum ProjectType {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  MIXED_USE = 'MIXED_USE',
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  PLOT = 'PLOT',
  OFFICE = 'OFFICE',
  SHOP = 'SHOP',
  WAREHOUSE = 'WAREHOUSE',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  state: string;

  @Column({ type: 'varchar', length: 20 })
  pincode: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.UNPUBLISHED,
  })
  status: ProjectStatus;

  @Column({
    type: 'enum',
    enum: ProjectType,
  })
  projectType: ProjectType;

  @Column({
    type: 'enum',
    enum: PropertyType,
  })
  propertyType: PropertyType;

  @Column({ type: 'int' })
  totalUnits: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalArea: number;

  @Column({ type: 'varchar', length: 50 })
  areaUnit: string;

  @Column({ type: 'date' })
  expectedCompletionDate: Date;

  @Column({ type: 'date' })
  constructionStartDate: Date;

  @Column({ type: 'json' })
  amenities: string[];

  @Column({ type: 'text', nullable: true })
  amenitiesDescription: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reraNumber: string;

  @Column({ type: 'date', nullable: true })
  reraApprovalDate: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  reraWebsite: string;

  @Column({ type: 'text', nullable: true })
  legalDetails: string;

  @Column({ type: 'json', nullable: true })
  approvals: {
    name: string;
    authority: string;
    approvalNumber: string;
    approvalDate: Date;
  }[];

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  minPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  maxPrice: number;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'json', nullable: true })
  floorPlans: {
    type: string;
    area: number;
    areaUnit: string;
    bedrooms: number;
    bathrooms: number;
    price: number;
  }[];

  @Column({ type: 'json', nullable: true })
  images: {
    url: string;
    type: string;
    caption: string;
  }[];

  @Column({ type: 'json', nullable: true })
  brochures: {
    url: string;
    name: string;
  }[];

  @Column({ type: 'uuid' })
  realEstateDeveloperId: string;

  @ManyToOne(() => RealEstateDeveloper, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'realEstateDeveloperId' })
  realEstateDeveloper: RealEstateDeveloper;

  @Column({ type: 'uuid' })
  projectManagerId: string;

  @ManyToOne(() => RealEstateDeveloperEmployee)
  @JoinColumn({ name: 'projectManagerId' })
  projectManager: RealEstateDeveloperEmployee;

  @Column({ type: 'uuid' })
  salesManagerId: string;

  @ManyToOne(() => RealEstateDeveloperEmployee)
  @JoinColumn({ name: 'salesManagerId' })
  salesManager: RealEstateDeveloperEmployee;

  @OneToMany(() => ProjectEmployee, (employee) => employee.project)
  projectEmployees: ProjectEmployee[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.project)
  bookmarks: Bookmark[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
