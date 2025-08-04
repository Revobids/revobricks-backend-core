import { Repository } from 'typeorm';
import { Office } from '../../entities';
import { CreateOfficeDto, UpdateOfficeDto } from '../../dto/office.dto';
export declare class OfficeService {
    private officeRepository;
    constructor(officeRepository: Repository<Office>);
    create(createOfficeDto: CreateOfficeDto, realEstateDeveloperId: string): Promise<Office>;
    findAll(realEstateDeveloperId?: string): Promise<Office[]>;
    findOne(id: string): Promise<Office>;
    update(id: string, updateOfficeDto: UpdateOfficeDto): Promise<Office>;
    remove(id: string): Promise<void>;
    findByDeveloper(developerId: string): Promise<Office[]>;
}
