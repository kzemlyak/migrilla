# 🔄 Transaction Guide

Migrilla uses a **functional approach** with callback-style transactions for reliable database operations.

> **Note**: Since v1.0.2, Migrilla uses factory functions instead of classes. Use `createMigrilla(config)` instead of `new Migrilla(config)`.

## 🎯 Transaction API (Callback-style)

Migrilla provides a single, reliable transaction approach that automatically manages the transaction lifecycle:

```javascript
const createMigrilla = require('migrilla');
const migrilla = createMigrilla(config);

await migrilla.executeInTransaction(async (client) => {
  await client.query('INSERT INTO users (name) VALUES ($1)', ['John']);
  await client.query('INSERT INTO orders (user_id, amount) VALUES ($1, $2)', [1, 100]);
  // Auto-commit on success, auto-rollback on error
});
```

### ✅ Advantages:
- **Automatic management** - No need to manually commit/rollback
- **Less verbose** - No try/catch required for transaction management
- **Safer** - Impossible to forget transaction cleanup
- **Cleaner code** - Focus on business logic
- **Predictable** - Same behavior every time

## 🔧 Internal Implementation

The transaction API uses a functional approach with closures:

```javascript
function createMigrilla(config) {
  const pool = new Pool(config);
  
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
  
  return { executeInTransaction, /* ... other methods */ };
}
```

## 🚀 Performance Benefits

The functional approach provides:
- **Reduced Memory Overhead**: No class instantiation
- **Faster Execution**: Direct function calls
- **Better Garbage Collection**: Closure scope management
- **Immutable State**: Configuration cannot be modified after creation

## 🎯 Best Practices

1. **Keep transactions short** to avoid blocking other connections
2. **Handle errors** appropriately with try/catch around transaction calls
3. **Use connection pooling** (which Migrilla does automatically)
4. **Test transaction rollback** scenarios in your applications
5. **Avoid nested transactions** - use a single transaction per operation

## 🦍 In Migrilla Migrations

Migrilla uses the **callback-style API** internally for migrations to ensure atomic execution:

```javascript
// Internal migration execution
await executeInTransaction(async (client) => {
  await runMigration(client, migration.up, migrationName);
  await markAsApplied(client, migrationName);
});
```

This ensures that if any part of the migration fails, both the SQL changes and the state tracking are rolled back completely.

## 📝 Usage Examples

### Basic Transaction
```javascript
const createMigrilla = require('migrilla');
const migrilla = createMigrilla(config);

await migrilla.executeInTransaction(async (client) => {
  await client.query('INSERT INTO users (name) VALUES ($1)', ['Alice']);
  await client.query('INSERT INTO user_profiles (user_id, email) VALUES (1, $1)', ['alice@example.com']);
});
```

### Error Handling
```javascript
try {
  await migrilla.executeInTransaction(async (client) => {
    await client.query('UPDATE accounts SET balance = balance - 100 WHERE id = 1');
    await client.query('UPDATE accounts SET balance = balance + 100 WHERE id = 2');
  });
  console.log('Transfer completed successfully');
} catch (error) {
  console.error('Transfer failed:', error.message);
  // Transaction was automatically rolled back
}
```

## 🔗 Related Documentation

- [README.md](README.md) - Main documentation
- [README_RU.md](README_RU.md) - Russian version
- [FEATURES.md](FEATURES.md) - Features overview
- [API_REFERENCE.md](API_REFERENCE.md) - Complete API documentation
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Project organization
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Version migration guide
- [SUMMARY.md](SUMMARY.md) - Project overview 