"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
async function investigateNeon() {
    console.log('🔍 Investigating Neon.tech database in detail...\n');
    const neonUrl = 'postgresql://neondb_owner:npg_fTRpCg80xbEM@ep-sparkling-dust-a17fmz3t-pooler.ap-southeast-1.aws.neon.tech/revobricks_db?sslmode=require&channel_binding=require';
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        url: neonUrl,
        ssl: { rejectUnauthorized: false },
    });
    try {
        await dataSource.initialize();
        console.log('✅ Connected to Neon.tech\n');
        const connInfo = await dataSource.query(`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        current_schema() as current_schema,
        version() as postgres_version
    `);
        console.log('📊 Connection Information:');
        console.log(`   Database: ${connInfo[0].database_name}`);
        console.log(`   User: ${connInfo[0].current_user}`);
        console.log(`   Schema: ${connInfo[0].current_schema}`);
        console.log(`   PostgreSQL: ${connInfo[0].postgres_version.split(' ')[0]} ${connInfo[0].postgres_version.split(' ')[1]}\n`);
        const schemas = await dataSource.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name
    `);
        console.log('📋 Available Schemas:');
        schemas.forEach((schema) => {
            console.log(`   • ${schema.schema_name}`);
        });
        console.log();
        const allTables = await dataSource.query(`
      SELECT 
        table_schema,
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY table_schema, table_name
    `);
        if (allTables.length === 0) {
            console.log('❌ NO TABLES FOUND IN ANY SCHEMA');
            console.log('\n🧪 Testing table creation...');
            try {
                await dataSource.query('CREATE TABLE test_table (id SERIAL PRIMARY KEY, name VARCHAR(50))');
                console.log('✅ Test table created successfully');
                const testCheck = await dataSource.query(`
          SELECT table_name FROM information_schema.tables 
          WHERE table_name = 'test_table' AND table_schema = 'public'
        `);
                if (testCheck.length > 0) {
                    console.log('✅ Test table is visible in information_schema');
                }
                else {
                    console.log('❌ Test table NOT visible in information_schema');
                }
                await dataSource.query('DROP TABLE test_table');
                console.log('🧹 Test table cleaned up');
            }
            catch (error) {
                console.log(`❌ Cannot create test table: ${error.message}`);
            }
        }
        else {
            console.log(`📋 Found ${allTables.length} tables across all schemas:`);
            allTables.forEach((table) => {
                console.log(`   • ${table.table_schema}.${table.table_name} (${table.table_type})`);
            });
        }
        console.log('\n📊 Database Statistics:');
        try {
            const dbStats = await dataSource.query(`
        SELECT 
          pg_size_pretty(pg_database_size(current_database())) as database_size,
          (SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()) as active_connections
      `);
            console.log(`   Database Size: ${dbStats[0].database_size}`);
            console.log(`   Active Connections: ${dbStats[0].active_connections}`);
        }
        catch (error) {
            console.log(`   Cannot get database stats: ${error.message}`);
        }
    }
    catch (error) {
        console.error('❌ Investigation failed:', error.message);
        if (error.code) {
            console.log(`   Error Code: ${error.code}`);
        }
    }
    finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
            console.log('\n✅ Connection closed');
        }
    }
}
investigateNeon().catch(console.error);
//# sourceMappingURL=investigate-neon.js.map