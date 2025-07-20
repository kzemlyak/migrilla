// Load environment variables from .env file
require('dotenv').config();

const createMigrilla = require('./index');

function createMigrillaCLI() {
  function getDbConfig() {
    return {
      host: process.env.MIGRILLA_DB_HOST || 'localhost',
      port: process.env.MIGRILLA_DB_PORT || 5432,
      database: process.env.MIGRILLA_DB_NAME || process.env.MIGRILLA_DATABASE_URL ? undefined : 'postgres',
      user: process.env.MIGRILLA_DB_USER || 'postgres',
      password: process.env.MIGRILLA_DB_PASSWORD || '',
      connectionString: process.env.MIGRILLA_DATABASE_URL,
      ssl: process.env.MIGRILLA_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };
  }

  function printUsage() {
    console.log(`
🦍 Migrilla - PostgreSQL Migration Tool

Usage:
  migrilla up              - Apply all pending migrations
  migrilla down [step]     - Rollback migrations (default: 1, max: all applied)
  migrilla status          - Show migration status
  migrilla help            - Show this help message

Examples:
  migrilla down            - Rollback 1 migration
  migrilla down 3          - Rollback 3 migrations
  migrilla down 5          - Rollback 5 migrations (or all if less than 5 applied)

Environment variables:
  MIGRILLA_DB_HOST          - Database host (default: localhost)
  MIGRILLA_DB_PORT          - Database port (default: 5432)
  MIGRILLA_DB_NAME          - Database name (default: postgres)
  MIGRILLA_DB_USER          - Database user (default: postgres)
  MIGRILLA_DB_PASSWORD      - Database password
  MIGRILLA_DATABASE_URL     - Full database connection string
  MIGRILLA_DB_SSL           - Use SSL connection (default: false)

Migration files should be placed in ./migrations/ directory with naming pattern:
  001_migration_name_up.sql
  001_migration_name_down.sql
    `);
  }

  async function run(args) {
    const command = args[0];

    if (!command || command === 'help') {
      printUsage();
      return;
    }

    const config = getDbConfig();
    const migrilla = createMigrilla(config);

    try {
      switch (command) {
        case 'up':
          await migrilla.up();
          break;
        case 'down':
          const step = args[1] ? parseInt(args[1]) : 1;
          if (isNaN(step) || step < 1) {
            console.error('❌ Step must be a positive number');
            process.exit(1);
          }
          await migrilla.down(step);
          break;
        case 'status':
          await migrilla.status();
          break;
        default:
          console.error(`❌ Unknown command: ${command}`);
          printUsage();
          process.exit(1);
      }
    } catch (error) {
      console.error('💥 Command failed:', error.message);
      process.exit(1);
    } finally {
      if (migrilla) {
        await migrilla.close();
      }
    }
  }

  return {
    run,
    printUsage,
    getDbConfig
  };
}

module.exports = createMigrillaCLI;
