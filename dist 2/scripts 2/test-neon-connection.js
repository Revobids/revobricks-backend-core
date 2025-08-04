"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
async function testNeonConnection() {
    console.log('🔍 Testing direct Neon.tech connection...');
    const neonUrl = 'postgresql://neondb_owner:npg_fTRpCg80xbEM@ep-sparkling-dust-a17fmz3t-pooler.ap-southeast-1.aws.neon.tech/revobricks_db?sslmode=require&channel_binding=require';
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        url: neonUrl,
        ssl: { rejectUnauthorized: false },
        logging: true,
    });
    try {
        console.log('📡 Connecting to Neon.tech...');
        await dataSource.initialize();
        console.log('✅ Connection successful!');
        console.log('\n🔍 Testing database queries...');
        const result = await dataSource.query('SELECT current_database(), current_user, version()');
        console.log('📊 Database info:');
        console.log(`   Database: ${result[0].current_database}`);
        console.log(`   User: ${result[0].current_user}`);
        console.log(`   Version: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}`);
        console.log('\n📋 Checking tables...');
        const tables = await dataSource.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
        if (tables.length > 0) {
            console.log(`✅ Found ${tables.length} tables:`);
            tables.forEach((table) => {
                console.log(`   • ${table.table_name} (${table.column_count} columns)`);
            });
        }
        else {
            console.log('❌ No tables found');
        }
        console.log('\n📊 Data counts:');
        const mainTables = ['real_estate_developers', 'projects', 'users', 'bookmarks'];
        for (const tableName of mainTables) {
            try {
                const countResult = await dataSource.query(`SELECT COUNT(*) as count FROM ${tableName}`);
                console.log(`   ${tableName}: ${countResult[0].count} records`);
            }
            catch (error) {
                console.log(`   ${tableName}: Not found or error`);
            }
        }
    }
    catch (error) {
        console.error('❌ Connection failed:', error.message);
        if (error.code) {
            console.log(`   Error Code: ${error.code}`);
        }
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Check if Neon.tech database is active');
        console.log('   2. Verify the connection string is correct');
        console.log('   3. Ensure your IP is allowed (if IP restrictions are set)');
        process.exit(1);
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('\n✅ Connection closed');
        }
    }
}
testNeonConnection().catch(console.error);
//# sourceMappingURL=test-neon-connection.js.map