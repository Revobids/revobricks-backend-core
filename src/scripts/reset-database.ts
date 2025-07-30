import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';

async function resetDatabase() {
  console.log('⚠️  Starting database reset...');
  console.log('⚠️  WARNING: This will DROP ALL DATA and recreate the schema!');

  // Initialize database connection
  const dataSource = new DataSource({
    ...typeOrmConfig,
    synchronize: true,
    dropSchema: true, // This will drop all tables
    logging: true,
  } as any);

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    // The schema will be dropped and recreated automatically due to dropSchema: true
    console.log('✅ Database schema reset successfully');

    console.log('\n🎯 Database has been completely reset');
    console.log('   • All tables dropped and recreated');
    console.log('   • All data has been removed');
    console.log('   • Schema is now fresh and ready');
    
    console.log('\n🎯 Next steps:');
    console.log('   • Run `npm run seed` to add test data');
    console.log('   • Start your application with `npm run start:dev`');

  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('✅ Database connection closed');
    }
  }
}

// Run the reset script
resetDatabase().catch(console.error);