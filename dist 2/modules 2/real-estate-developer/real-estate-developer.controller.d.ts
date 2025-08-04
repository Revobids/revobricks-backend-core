import { RealEstateDeveloperService } from './real-estate-developer.service';
import { CreateRealEstateDeveloperDto, UpdateRealEstateDeveloperDto } from '../../dto/real-estate-developer.dto';
export declare class RealEstateDeveloperController {
    private readonly developerService;
    constructor(developerService: RealEstateDeveloperService);
    create(createDto: CreateRealEstateDeveloperDto): Promise<import("../../entities").RealEstateDeveloper>;
    findAll(): Promise<import("../../entities").RealEstateDeveloper[]>;
    findOne(id: string): Promise<import("../../entities").RealEstateDeveloper>;
    update(id: string, updateDto: UpdateRealEstateDeveloperDto): Promise<import("../../entities").RealEstateDeveloper>;
    remove(id: string): Promise<void>;
}
