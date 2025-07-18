# 📖 API Reference

Complete reference for the Migrilla API.

## 🏗️ Factory Function

### `createMigrilla(config)`

Creates a new Migrilla instance.

**Parameters:**
- `config` (Object) - Configuration object
  - `host` (String) - Database host (default: 'localhost')
  - `port` (Number) - Database port (default: 5432)
  - `database` (String) - Database name (default: 'postgres')
  - `user` (String) - Database user (default: 'postgres')
  - `password` (String) - Database password
  - `connectionString` (String) - Full connection string
  - `ssl` (Boolean|Object) - SSL configuration
  - `migrationsDir` (String) - Directory with migration files (default: './migrations')
  - `stateTable` (String) - Table name for tracking migrations (default: 'migrilla_state')

**Example:**
```javascript
const migrilla = createMigrilla({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password',
  migrationsDir: './db/migrations',
  stateTable: 'my_migrations'
});
```

## 🔧 Core Methods

### `async init()`

Initializes the migration state table.

**Returns:** Promise<void>

**Example:**
```javascript
await migrilla.init();
```

### `async up()`

Applies all pending migrations.

**Returns:** Promise<void>

**Example:**
```javascript
await migrilla.up();
```

### `async down()`

Rolls back the last applied migration.

**Returns:** Promise<void>

**Example:**
```javascript
await migrilla.down();
```

### `async status()`

Displays the current migration status.

**Returns:** Promise<void>

**Example:**
```javascript
await migrilla.status();
```

### `async close()`

Closes the database connection pool.

**Returns:** Promise<void>

**Example:**
```javascript
await migrilla.close();
```

## 🔄 Transaction Methods

### `async transaction()`

Creates a new transaction object for high-level transaction control.

**Returns:** Promise<MigrillaTransaction>

**Example:**
```javascript
const trx = await migrilla.transaction();
try {
  await migrilla.query('INSERT INTO users (name) VALUES ($1)', ['John'], trx);
  await trx.commit();
} catch (error) {
  await trx.rollback();
}
```

### `async executeInTransaction(operation)`

Executes an operation within a transaction with automatic management.

**Parameters:**
- `operation` (Function) - Async function that receives a client

**Returns:** Promise<void>

**Example:**
```javascript
await migrilla.executeInTransaction(async (client) => {
  await client.query('INSERT INTO users (name) VALUES ($1)', ['John']);
  await client.query('UPDATE stats SET count = count + 1');
});
```

### `async query(sql, params, transaction)`

Executes a SQL query with optional transaction.

**Parameters:**
- `sql` (String) - SQL query string
- `params` (Array) - Query parameters (optional)
- `transaction` (MigrillaTransaction) - Transaction object (optional)

**Returns:** Promise<QueryResult>

**Example:**
```javascript
// Without transaction
const result = await migrilla.query('SELECT * FROM users WHERE id = $1', [1]);

// With transaction
const trx = await migrilla.transaction();
await migrilla.query('INSERT INTO users (name) VALUES ($1)', ['John'], trx);
await trx.commit();
```

## 🔍 Internal Methods

### `async getMigrationFiles()`

Discovers and parses migration files from the migrations directory.

**Returns:** Promise<Array<MigrationFile>>

**MigrationFile Object:**
```javascript
{
  number: 1,
  name: 'add_users_table',
  up: '/path/to/001_add_users_table_up.sql',
  down: '/path/to/001_add_users_table_down.sql'
}
```

### `async getAppliedMigrations()`

Gets list of applied migrations from the state table.

**Returns:** Promise<Array<String>>

### `async runMigration(clientOrTransaction, filePath, migrationName)`

Executes a single migration file.

**Parameters:**
- `clientOrTransaction` - Database client or transaction object
- `filePath` (String) - Path to SQL file
- `migrationName` (String) - Migration name for logging

### `async markAsApplied(clientOrTransaction, migrationName)`

Marks a migration as applied in the state table.

**Parameters:**
- `clientOrTransaction` - Database client or transaction object
- `migrationName` (String) - Migration name

### `async markAsReverted(clientOrTransaction, migrationName)`

Removes a migration from the state table.

**Parameters:**
- `clientOrTransaction` - Database client or transaction object
- `migrationName` (String) - Migration name

## 📋 MigrillaTransaction Class

### `async commit()`

Commits the transaction and releases the connection.

**Returns:** Promise<void>

**Example:**
```javascript
const trx = await migrilla.transaction();
await migrilla.query('INSERT INTO users (name) VALUES ($1)', ['John'], trx);
await trx.commit();
```

### `async rollback()`

Rolls back the transaction and releases the connection.

**Returns:** Promise<void>

**Example:**
```javascript
const trx = await migrilla.transaction();
try {
  await migrilla.query('INSERT INTO users (name) VALUES ($1)', ['John'], trx);
  await trx.commit();
} catch (error) {
  await trx.rollback();
}
```

### Properties

- `client` - The underlying pg client
- `isCommitted` (Boolean) - Whether transaction is committed
- `isRolledBack` (Boolean) - Whether transaction is rolled back

## 🚨 Error Handling

All methods can throw errors. Always wrap in try/catch blocks:

```javascript
try {
  await migrilla.up();
} catch (error) {
  console.error('Migration failed:', error.message);
}
```

## 📁 Migration File Naming

Migration files must follow this naming convention:

```
NNN_description_up.sql      # Apply migration
NNN_description_down.sql    # Rollback migration
```

Where:
- `NNN` is a zero-padded number (001, 002, etc.)
- `description` is a descriptive name
- `up` applies the migration
- `down` reverts the migration

## 🌍 Environment Variables

The CLI uses these environment variables:

- `MIGRILLA_DB_HOST` - Database host
- `MIGRILLA_DB_PORT` - Database port
- `MIGRILLA_DB_NAME` - Database name
- `MIGRILLA_DB_USER` - Database user
- `MIGRILLA_DB_PASSWORD` - Database password
- `MIGRILLA_DATABASE_URL` - Full connection string
- `MIGRILLA_DB_SSL` - Use SSL connection

## 📊 State Table Schema

Migrilla creates a state table with this schema:

```sql
CREATE TABLE migrilla_state (
  id SERIAL PRIMARY KEY,
  migration_name VARCHAR(255) NOT NULL UNIQUE,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Best Practices

1. **Always use transactions** for data consistency
2. **Test both up and down migrations** before deploying
3. **Keep migrations idempotent** when possible
4. **Use descriptive migration names**
5. **Handle errors appropriately** in your application
6. **Close connections** when done (`await migrilla.close()`)
7. **Use environment variables** for configuration in production

## 🔗 Related Documentation

- [README.md](README.md) - Main documentation
- [README_RU.md](README_RU.md) - Russian version
- [FEATURES.md](FEATURES.md) - Features overview
- [TRANSACTION_GUIDE.md](TRANSACTION_GUIDE.md) - Transaction API guide
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Project organization
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Version migration guide
- [SUMMARY.md](SUMMARY.md) - Project overview 