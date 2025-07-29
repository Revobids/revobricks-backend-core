import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RealEstateDeveloper } from './real-estate-developer.entity';
import { Office } from './office.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  SALES_MANAGER = 'sales_manager',
  SALES_EXECUTIVE = 'sales_executive',
  SALES = 'sales',
  FINANCE = 'finance',
}

@Entity('real_estate_developer_employees')
export class RealEstateDeveloperEmployee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  employeeId: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SALES,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  firebaseUid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => RealEstateDeveloper, (developer) => developer.employees)
  @JoinColumn({ name: 'realEstateDeveloperId' })
  realEstateDeveloper: RealEstateDeveloper;

  @Column()
  realEstateDeveloperId: string;

  @ManyToOne(() => Office, (office) => office.employees)
  @JoinColumn({ name: 'officeId' })
  office: Office;

  @Column()
  officeId: string;
}
