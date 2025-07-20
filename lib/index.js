const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

function createMigrilla(config = {}) {
  const pool = new Pool(config);
  const migrationsDir = config.migrationsDir || './migrations';
  const stateTable = config.stateTable || 'migrilla_state';

  async function init() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ${stateTable} (
          id SERIAL PRIMARY KEY,
          migration_name VARCHAR(255) NOT NULL UNIQUE,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Migrilla initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Migrilla:', error.message);
      throw error;
    }
  }

  async function getMigrationFiles() {
    try {
      const files = await fs.promises.readdir(migrationsDir);
      const migrations = new Map();

      for (const file of files) {
        const match = file.match(/^(\d+)_(.+)_(up|down)\.sql$/);
        if (match) {
          const [, number, name, direction] = match;
          const key = `${number}_${name}`;

          if (!migrations.has(key)) {
            migrations.set(key, { number: parseInt(number), name, up: null, down: null });
          }
          
          migrations.get(key)[direction] = path.join(migrationsDir, file);
        }
      }

      return Array.from(migrations.values())
        .sort((a, b) => a.number - b.number);
    } catch (error) {
      console.error('❌ Failed to read migrations directory:', error.message);
      throw error;
    }
  }

  async function getAppliedMigrations() {
    try {
      const result = await pool.query(
        `SELECT migration_name FROM ${stateTable} ORDER BY applied_at`
      );
      return result.rows.map(row => row.migration_name);
    } catch (error) {
      console.error('❌ Failed to get applied migrations:', error.message);
      throw error;
    }
  }

  async function runMigration(client, filePath, migrationName) {
    try {
      const sql = await fs.promises.readFile(filePath, 'utf8');
      await client.query(sql);
      console.log(`✅ Executed: ${migrationName}`);
    } catch (error) {
      console.error(`❌ Failed to execute ${migrationName}:`, error.message);
      throw error;
    }
  }

  async function markAsApplied(client, migrationName) {
    try {
      const sql = `INSERT INTO ${stateTable} (migration_name) VALUES ($1)`;
      await client.query(sql, [migrationName]);
    } catch (error) {
      console.error('❌ Failed to mark migration as applied:', error.message);
      throw error;
    }
  }

  async function markAsReverted(client, migrationName) {
    try {
      const sql = `DELETE FROM ${stateTable} WHERE migration_name = $1`;
      await client.query(sql, [migrationName]);
    } catch (error) {
      console.error('❌ Failed to mark migration as reverted:', error.message);
      throw error;
    }
  }

  async function executeInTransaction(operation) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await operation(client);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async function up() {
    try {
      await init();

      const migrations = await getMigrationFiles();
      const appliedMigrations = await getAppliedMigrations();
      
      let hasNewMigrations = false;

      for (const migration of migrations) {
        const migrationName = `${migration.number.toString().padStart(3, '0')}_${migration.name}`;

        if (!appliedMigrations.includes(migrationName)) {
          if (!migration.up) {
            console.error(`❌ Missing up migration file for: ${migrationName}`);
            continue;
          }

          console.log(`🔄 Applying migration: ${migrationName}`);

          await executeInTransaction(async (client) => {
            await runMigration(client, migration.up, migrationName);
            await markAsApplied(client, migrationName);
          });

          hasNewMigrations = true;
        }
      }
      
      if (!hasNewMigrations) {
        console.log('✅ No new migrations to apply');
      } else {
        console.log('🎉 All migrations applied successfully!');
      }
    } catch (error) {
      console.error('💥 Migration failed:', error.message);
      throw error;
    }
  }

  async function down(step = 1) {
    try {
      await init();

      const migrations = await getMigrationFiles();
      const appliedMigrations = await getAppliedMigrations();

      if (appliedMigrations.length === 0) {
        console.log('✅ No migrations to rollback');
        return;
      }

      // Validate step parameter
      if (step < 1) {
        console.error('❌ Step must be a positive number');
        return;
      }

      if (step > appliedMigrations.length) {
        console.log(`⚠️  Requested to rollback ${step} migrations, but only ${appliedMigrations.length} are applied`);
        step = appliedMigrations.length;
      }

      console.log(`🔄 Rolling back ${step} migration(s)...`);

      // Get the migrations to rollback (from newest to oldest)
      const migrationsToRollback = appliedMigrations.slice(-step).reverse();

      for (const migrationName of migrationsToRollback) {
        const migration = migrations.find(m => {
          const expectedName = `${m.number.toString().padStart(3, '0')}_${m.name}`;
          return expectedName === migrationName;
        });

        if (!migration) {
          console.error(`❌ Migration file not found for: ${migrationName}`);
          continue;
        }

        if (!migration.down) {
          console.error(`❌ Missing down migration file for: ${migrationName}`);
          continue;
        }

        console.log(`🔄 Rolling back migration: ${migrationName}`);
        await executeInTransaction(async (client) => {
          await runMigration(client, migration.down, migrationName);
          await markAsReverted(client, migrationName);
        });
      }

      if (step === 1) {
        console.log('✅ Migration rolled back successfully!');
      } else {
        console.log(`✅ ${step} migrations rolled back successfully!`);
      }
    } catch (error) {
      console.error('💥 Rollback failed:', error.message);
      throw error;
    }
  }

  async function status() {
    try {
      await init();

      const migrations = await getMigrationFiles();
      const appliedMigrations = await getAppliedMigrations();

      console.log('\n📊 Migration Status:');
      console.log('==================');

      for (const migration of migrations) {
        const migrationName = `${migration.number.toString().padStart(3, '0')}_${migration.name}`;
        const isApplied = appliedMigrations.includes(migrationName);
        const status = isApplied ? '✅ Applied' : '⏳ Pending';

        console.log(`${status} | ${migrationName}`);
      }

      console.log('\n📈 Summary:');
      console.log(`Total migrations: ${migrations.length}`);
      console.log(`Applied: ${appliedMigrations.length}`);
      console.log(`Pending: ${migrations.length - appliedMigrations.length}`);
    } catch (error) {
      console.error('❌ Failed to get status:', error.message);
      throw error;
    }
  }

  async function close() {
    await pool.end();
  }

  return {
    init,
    getMigrationFiles,
    getAppliedMigrations,
    runMigration,
    markAsApplied,
    markAsReverted,
    executeInTransaction,
    up,
    down,
    status,
    close
  };
}

module.exports = createMigrilla;
