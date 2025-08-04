import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
declare const UserJwtStrategy_base: new (...args: any) => any;
export declare class UserJwtStrategy extends UserJwtStrategy_base {
    private userRepository;
    constructor(userRepository: Repository<User>);
    validate(payload: any): Promise<User>;
}
export {};
