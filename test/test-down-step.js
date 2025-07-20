require('dotenv').config();

const createMigrilla = require('../lib/index');

async function testDownWithStep() {
  console.log('🧪 Testing down method with step parameter...\n');
  
  // Test configuration - same as CLI
  const config = {
    host: process.env.MIGRILLA_DB_HOST || 'localhost',
    port: process.env.MIGRILLA_DB_PORT || 5432,
    database: process.env.MIGRILLA_DB_NAME || process.env.MIGRILLA_DATABASE_URL ? undefined : 'postgres',
    user: process.env.MIGRILLA_DB_USER || 'postgres',
    password: process.env.MIGRILLA_DB_PASSWORD || '',
    connectionString: process.env.MIGRILLA_DATABASE_URL,
    ssl: process.env.MIGRILLA_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };

  const migrilla = createMigrilla(config);
  
  try {
    await migrilla.init();
    
    // Get current applied migrations
    const appliedMigrations = await migrilla.getAppliedMigrations();
    console.log(`📊 Found ${appliedMigrations.length} applied migration(s)`);
    
    // Test 1: down() without step (should default to 1)
    console.log('\n1. Testing down() without step parameter...');
    await migrilla.down();
    
    // Test 2: down(1) explicitly
    console.log('\n2. Testing down(1) explicitly...');
    await migrilla.down(1);
    
    // Test 3: down with step > 1
    console.log('\n3. Testing down(2) to rollback 2 migrations...');
    await migrilla.down(2);
    
    // Test 4: down with step larger than available migrations
    console.log('\n4. Testing down with step larger than available migrations...');
    await migrilla.down(10);
    
    // Test 5: down with invalid step (0)
    console.log('\n5. Testing down with invalid step (0)...');
    await migrilla.down(0);
    
    // Test 6: down with invalid step (negative)
    console.log('\n6. Testing down with invalid step (-1)...');
    await migrilla.down(-1);
    
    console.log('\n🎉 All down method tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await migrilla.close();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testDownWithStep();
}

module.exports = testDownWithStep; 