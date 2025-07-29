import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { RealEstateDeveloperEmployee } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([RealEstateDeveloperEmployee])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
