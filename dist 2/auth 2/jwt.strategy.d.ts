import { Repository } from 'typeorm';
import { RealEstateDeveloperEmployee } from '../entities';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private employeeRepository;
    constructor(employeeRepository: Repository<RealEstateDeveloperEmployee>);
    validate(payload: any): Promise<RealEstateDeveloperEmployee>;
}
export {};
