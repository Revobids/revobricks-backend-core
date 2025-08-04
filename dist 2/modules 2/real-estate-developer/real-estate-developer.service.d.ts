import { Repository } from 'typeorm';
import { RealEstateDeveloper, RealEstateDeveloperEmployee, Office } from '../../entities';
import { CreateRealEstateDeveloperDto, UpdateRealEstateDeveloperDto } from '../../dto/real-estate-developer.dto';
export declare class RealEstateDeveloperService {
    private developerRepository;
    private employeeRepository;
    private officeRepository;
    constructor(developerRepository: Repository<RealEstateDeveloper>, employeeRepository: Repository<RealEstateDeveloperEmployee>, officeRepository: Repository<Office>);
    create(createDto: CreateRealEstateDeveloperDto): Promise<RealEstateDeveloper>;
    findAll(): Promise<RealEstateDeveloper[]>;
    findOne(id: string): Promise<RealEstateDeveloper>;
    update(id: string, updateDto: UpdateRealEstateDeveloperDto): Promise<RealEstateDeveloper>;
    remove(id: string): Promise<void>;
}
