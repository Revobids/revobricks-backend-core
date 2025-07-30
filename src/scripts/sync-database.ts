import { config } from 'dotenv';
config(); // Load environment variables

import { DataSource } from 'typeorm';
import { typeOrmConfig } from '../config/typeorm.config';

async function syncDatabase() {
  console.log('🔄 Starting database synchronization...');

  // Initialize database connection
  const dataSource = new DataSource({
    ...typeOrmConfig,
    synchronize: true, // Force synchronization
    logging: true, // Enable logging to see what's happening
  } as any);

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    // Synchronize the database schema
    await dataSource.synchronize(false); // false = don't drop existing data
    console.log('✅ Database schema synchronized successfully');

    console.log('\nℹ️  Changes applied:');
    console.log('   • Entity changes synced to database');
    console.log('   • New columns added if any');
    console.log('   • Indexes updated if any');
    console.log('   • Constraints updated if any');
    
    console.log('\n🎯 Next steps:');
    console.log('   • Run `npm run seed` if you need test data');
    console.log('   • Start your application with `npm run start:dev`');

  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('✅ Database connection closed');
    }
  }
}

// Run the sync script
syncDatabase().catch(console.error);