"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const typeorm_1 = require("typeorm");
const typeorm_config_1 = require("../config/typeorm.config");
async function resetDatabase() {
    console.log('⚠️  Starting database reset...');
    console.log('⚠️  WARNING: This will DROP ALL DATA and recreate the schema!');
    const dataSource = new typeorm_1.DataSource({
        ...typeorm_config_1.typeOrmConfig,
        synchronize: true,
        dropSchema: true,
        logging: true,
    });
    try {
        await dataSource.initialize();
        console.log('✅ Database connected');
        console.log('✅ Database schema reset successfully');
        console.log('\n🎯 Database has been completely reset');
        console.log('   • All tables dropped and recreated');
        console.log('   • All data has been removed');
        console.log('   • Schema is now fresh and ready');
        console.log('\n🎯 Next steps:');
        console.log('   • Run `npm run seed` to add test data');
        console.log('   • Start your application with `npm run start:dev`');
    }
    catch (error) {
        console.error('❌ Database reset failed:', error);
        process.exit(1);
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('✅ Database connection closed');
        }
    }
}
resetDatabase().catch(console.error);
//# sourceMappingURL=reset-database.js.map