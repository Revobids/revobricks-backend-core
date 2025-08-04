"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const typeorm_1 = require("typeorm");
const typeorm_config_1 = require("../config/typeorm.config");
async function syncDatabase() {
    console.log('🔄 Starting database synchronization...');
    const dataSource = new typeorm_1.DataSource({
        ...typeorm_config_1.typeOrmConfig,
        synchronize: true,
        logging: true,
    });
    try {
        await dataSource.initialize();
        console.log('✅ Database connected');
        await dataSource.synchronize(false);
        console.log('✅ Database schema synchronized successfully');
        console.log('\nℹ️  Changes applied:');
        console.log('   • Entity changes synced to database');
        console.log('   • New columns added if any');
        console.log('   • Indexes updated if any');
        console.log('   • Constraints updated if any');
        console.log('\n🎯 Next steps:');
        console.log('   • Run `npm run seed` if you need test data');
        console.log('   • Start your application with `npm run start:dev`');
    }
    catch (error) {
        console.error('❌ Database synchronization failed:', error);
        process.exit(1);
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('✅ Database connection closed');
        }
    }
}
syncDatabase().catch(console.error);
//# sourceMappingURL=sync-database.js.map