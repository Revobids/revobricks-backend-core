"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const entities_1 = require("../entities");
exports.typeOrmConfig = process.env.DATABASE_URL ? {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: true,
    entities: [
        entities_1.RealEstateDeveloper,
        entities_1.RealEstateDeveloperEmployee,
        entities_1.Office,
        entities_1.Project,
        entities_1.ProjectEmployee,
        entities_1.User,
        entities_1.Bookmark,
    ],
    synchronize: process.env.NODE_ENV !== 'production',
    dropSchema: false,
    logging: process.env.NODE_ENV === 'development',
} : {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'backend_core',
    entities: [
        entities_1.RealEstateDeveloper,
        entities_1.RealEstateDeveloperEmployee,
        entities_1.Office,
        entities_1.Project,
        entities_1.ProjectEmployee,
        entities_1.User,
        entities_1.Bookmark,
    ],
    synchronize: process.env.NODE_ENV !== 'production',
    dropSchema: false,
    logging: process.env.NODE_ENV === 'development',
};
//# sourceMappingURL=typeorm.config.js.map