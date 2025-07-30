import { config } from 'dotenv';
config(); // Load environment variables

import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';

async function checkDatabase() {
  console.log('🔍 Checking database connection and tables...');
  console.log(`📍 Database URL: ${process.env.DATABASE_URL ? 'Found' : 'Not found'}`);

  // Initialize database connection
  const dataSource = new DataSource(typeOrmConfig as any);

  try {
    await dataSource.initialize();
    console.log('✅ Database connection successful');

    // Check if tables exist
    console.log('\n📋 Checking existing tables...');
    
    const queryRunner = dataSource.createQueryRunner();
    
    // List all tables
    const tables = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    if (tables.length === 0) {
      console.log('❌ No tables found in the database');
      console.log('\n🛠️  Recommendation: Run `npm run db:setup` to create tables and add test data');
    } else {
      console.log(`✅ Found ${tables.length} tables:`);
      tables.forEach((table: any, index: number) => {
        console.log(`   ${index + 1}. ${table.table_name}`);
      });
      
      // Check row counts for main tables
      console.log('\n📊 Table row counts:');
      const mainTables = ['users', 'real_estate_developers', 'projects', 'bookmarks'];
      
      for (const tableName of mainTables) {
        try {
          const result = await queryRunner.query(`SELECT COUNT(*) as count FROM ${tableName}`);
          console.log(`   ${tableName}: ${result[0].count} rows`);
        } catch (error) {
          console.log(`   ${tableName}: Table not found`);
        }
      }
    }
    
    await queryRunner.release();

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Troubleshooting suggestions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify the DATABASE_URL in your .env file');
      console.log('   3. Make sure the Neon.tech database is active');
    } else if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Authentication issue:');
      console.log('   1. Check if the database credentials are correct');
      console.log('   2. Verify the DATABASE_URL format');
    }
    
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('\n✅ Database connection closed');
    }
  }
}

// Run the check script
checkDatabase().catch(console.error);