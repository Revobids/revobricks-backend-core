import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RealEstateDeveloperEmployee } from './real-estate-developer-employee.entity';
import { Office } from './office.entity';

@Entity('real_estate_developers')
export class RealEstateDeveloper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => RealEstateDeveloperEmployee,
    (employee) => employee.realEstateDeveloper,
  )
  employees: RealEstateDeveloperEmployee[];

  @OneToMany(() => Office, (office) => office.realEstateDeveloper)
  offices: Office[];
}
