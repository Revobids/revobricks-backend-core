import { OfficeService } from './office.service';
import { CreateOfficeDto, UpdateOfficeDto } from '../../dto/office.dto';
import { RealEstateDeveloperEmployee } from '../../entities';
export declare class OfficeController {
    private readonly officeService;
    constructor(officeService: OfficeService);
    create(createOfficeDto: CreateOfficeDto, user: RealEstateDeveloperEmployee): Promise<import("../../entities").Office>;
    findAll(user: RealEstateDeveloperEmployee): Promise<import("../../entities").Office[]>;
    findOne(id: string): Promise<import("../../entities").Office>;
    update(id: string, updateOfficeDto: UpdateOfficeDto): Promise<import("../../entities").Office>;
    remove(id: string): Promise<void>;
}
