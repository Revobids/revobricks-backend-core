import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Project } from './project.entity';
import { RealEstateDeveloperEmployee } from './real-estate-developer-employee.entity';

export enum ProjectRole {
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_EXECUTIVE = 'SALES_EXECUTIVE',
  SITE_ENGINEER = 'SITE_ENGINEER',
  ARCHITECT = 'ARCHITECT',
  LEGAL_ADVISOR = 'LEGAL_ADVISOR',
  MARKETING = 'MARKETING',
  OTHER = 'OTHER',
}

@Entity('project_employees')
@Unique(['projectId', 'employeeId'])
export class ProjectEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @ManyToOne(() => Project, (project) => project.projectEmployees, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column({ type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => RealEstateDeveloperEmployee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: RealEstateDeveloperEmployee;

  @Column({
    type: 'enum',
    enum: ProjectRole,
  })
  role: ProjectRole;

  @Column({ type: 'date' })
  assignedDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
