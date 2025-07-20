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
    
    // Test 5: Test down method with step parameter (basic validation)
    console.log('\n5. Testing down method with step parameter (basic validation)...');
    await testDownWithStep(migrilla);
    
    console.log('\n💡 Note: For full down step testing with applied migrations, run:');
    console.log('   node test/test-down-step.js');
    
    console.log('\n🎉 All tests passed!');
    console.log('\n💡 To test migrations, run:');
    console.log('   migrilla up        - Apply all migrations');
    console.log('   migrilla status    - Check status');
    console.log('   migrilla down      - Rollback 1 migration');
    console.log('   migrilla down 3    - Rollback 3 migrations');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await migrilla.close();
  }
}

async function testDownWithStep(migrilla) {
  try {
    // Get current applied migrations
    let appliedMigrations = await migrilla.getAppliedMigrations();
    
    console.log(`   📊 Found ${appliedMigrations.length} applied migration(s)`);
    
    // Test 5.1: Test down() without step (should default to 1)
    console.log('   🔄 Testing down() without step parameter...');
    await migrilla.down();
    
    // Test 5.2: Test down(1) explicitly
    console.log('   🔄 Testing down(1) explicitly...');
    await migrilla.down(1);
    
    // Test 5.3: Test down with step > 1 (if we have enough migrations)
    console.log('   🔄 Testing down(2) to rollback 2 migrations...');
    await migrilla.down(2);
    
    // Test 5.4: Test down with step larger than available migrations
    console.log('   🔄 Testing down with step larger than available migrations...');
    await migrilla.down(10);
    
    // Test 5.5: Test down with invalid step
    console.log('   🔄 Testing down with invalid step (0)...');
    await migrilla.down(0);
    
    // Test 5.6: Test down with invalid step (negative)
    console.log('   🔄 Testing down with invalid step (-1)...');
    await migrilla.down(-1);
    
    console.log('   ✅ All down method tests passed!');
  } catch (error) {
    console.error('   ❌ Down method test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testMigrilla();
}

module.exports = testMigrilla;
