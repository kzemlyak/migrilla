require('dotenv').config();

const createMigrilla = require('../lib/index');
const fs = require('fs');

async function testMigrilla() {
  console.log('🧪 Testing Migrilla functionality...\n');
  
  // Test configuration
  const config = {
    host: process.env.MIGRILLA_DB_HOST || 'localhost',
    port: process.env.MIGRILLA_DB_PORT || 5432,
    database: process.env.MIGRILLA_DB_NAME || 'test_migrilla',
    user: process.env.MIGRILLA_DB_USER || 'postgres',
    password: process.env.MIGRILLA_DB_PASSWORD || '',
    connectionString: process.env.MIGRILLA_DATABASE_URL
  };

  const migrilla = createMigrilla(config);
  
  try {
    // Test 1: Check migrations directory exists
    console.log('1. Checking migrations directory...');
    if (fs.existsSync('./migrations')) {
      console.log('✅ Migrations directory exists');
    } else {
      console.log('❌ Migrations directory not found');
      return;
    }
    
    // Test 2: Check migration files
    console.log('\n2. Checking migration files...');
    const migrations = await migrilla.getMigrationFiles();
    console.log(`✅ Found ${migrations.length} migration(s)`);
    
    for (const migration of migrations) {
      const migrationName = `${migration.number.toString().padStart(3, '0')}_${migration.name}`;
      console.log(`   📄 ${migrationName}`);
      console.log(`      Up: ${migration.up ? '✅' : '❌'}`);
      console.log(`      Down: ${migration.down ? '✅' : '❌'}`);
    }
    
    // Test 3: Database connection
    console.log('\n3. Testing database connection...');
    try {
      await migrilla.init();
      console.log('✅ Database connection successful');
    } catch (error) {
      console.log('❌ Database connection failed:', error.message);
      console.log('💡 Make sure PostgreSQL is running and connection details are correct');
      return;
    }
    
    // Test 4: Show current status
    console.log('\n4. Current migration status:');
    await migrilla.status();
    
    console.log('\n🎉 All tests passed!');
    console.log('\n💡 To test migrations, run:');
    console.log('   migrilla up    - Apply all migrations');
    console.log('   migrilla status - Check status');
    console.log('   migrilla down  - Rollback last migration');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await migrilla.close();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testMigrilla();
}

module.exports = testMigrilla;
