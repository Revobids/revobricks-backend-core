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

@Entity('offices')
export class Office {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  isMainOffice: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => RealEstateDeveloper, (developer) => developer.offices)
  @JoinColumn({ name: 'realEstateDeveloperId' })
  realEstateDeveloper: RealEstateDeveloper;

  @Column()
  realEstateDeveloperId: string;

  @OneToMany(() => RealEstateDeveloperEmployee, (employee) => employee.office)
  employees: RealEstateDeveloperEmployee[];
}
