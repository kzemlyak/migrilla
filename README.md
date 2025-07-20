# 🦍 Migrilla

Simple PostgreSQL migration tool for Node.js applications.

> 🇷🇺 **[Русская версия](README_RU.md)** | 🇺🇸 **English version**

> 🚀 **[Quick Start Guide](QUICKSTART.md)** - Get started in under 5 minutes!
> 🐳 **[Docker Setup](DOCKER_SETUP.md)** - Test with Docker!
> 🐳 **[Docker Quick Start](QUICKSTART_DOCKER.md)** - Docker setup in 2 minutes!

## 🚀 Installation

```bash
npm install migrilla
```

## ⚙️ Usage

### Commands

```bash
migrilla up              # Apply all pending migrations
migrilla down [step]     # Rollback migrations (default: 1, max: all applied)
migrilla status          # Show migration status
migrilla help            # Show help message
```

### Environment Variables

Configure database connection using environment variables:

```bash
MIGRILLA_DB_HOST=localhost           # Database host (default: localhost)
MIGRILLA_DB_PORT=5432               # Database port (default: 5432)
MIGRILLA_DB_NAME=myapp              # Database name (default: postgres)
MIGRILLA_DB_USER=postgres           # Database user (default: postgres)
MIGRILLA_DB_PASSWORD=mypassword     # Database password
MIGRILLA_DATABASE_URL=postgres://user:pass@host:port/db  # Full connection string
MIGRILLA_DB_SSL=true                # Use SSL connection (default: false)
```

## 💾 How It Works

✅ Reads SQL files from `migrations/` directory  
✅ Tracks applied migrations in `migrilla_state` table  
✅ **Atomic execution** - each migration runs in a transaction  
✅ Provides beautiful console output  
✅ Handles errors gracefully  

## 🦍 Migration Files

Create migration files in the `migrations/` directory:

### File Naming Pattern
```
001_migration_name_up.sql    # Apply migration
001_migration_name_down.sql  # Rollback migration
```

### Example Structure
```
migrations/
├── 001_add_users_table_up.sql
├── 001_add_users_table_down.sql
├── 002_add_orders_table_up.sql
├── 002_add_orders_table_down.sql
└── 003_add_indexes_up.sql
└── 003_add_indexes_down.sql
```

## 📚 Examples

### Example Migration Files

**001_add_users_table_up.sql**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**001_add_users_table_down.sql**
```sql
DROP TABLE IF EXISTS users;
```

**002_add_orders_table_up.sql**
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**002_add_orders_table_down.sql**
```sql
DROP TABLE IF EXISTS orders;
```

### Running Migrations

```bash
# Apply all pending migrations
migrilla up

# Check migration status
migrilla status

# Rollback 1 migration (default)
migrilla down

# Rollback 3 migrations
migrilla down 3

# Rollback all applied migrations
migrilla down 999
```

### Example Output

```bash
$ migrilla up
✅ Migrilla initialized successfully
🔄 Applying migration: 001_add_users_table
✅ Executed: 001_add_users_table
🔄 Applying migration: 002_add_orders_table
✅ Executed: 002_add_orders_table
🎉 All migrations applied successfully!

$ migrilla status

📊 Migration Status:
==================
✅ Applied | 001_add_users_table
✅ Applied | 002_add_orders_table
⏳ Pending | 003_add_indexes

📈 Summary:
Total migrations: 3
Applied: 2
Pending: 1

$ migrilla down
✅ Migrilla initialized successfully
🔄 Rolling back 1 migration(s)...
🔄 Rolling back migration: 002_add_orders_table
✅ Executed: 002_add_orders_table
✅ Migration rolled back successfully!

$ migrilla down 3
✅ Migrilla initialized successfully
🔄 Rolling back 3 migration(s)...
🔄 Rolling back migration: 003_add_indexes
✅ Executed: 003_add_indexes
🔄 Rolling back migration: 002_add_orders_table
✅ Executed: 002_add_orders_table
🔄 Rolling back migration: 001_add_users_table
✅ Executed: 001_add_users_table
✅ 3 migrations rolled back successfully!
```

## 🔧 Programmatic Usage

You can also use Migrilla programmatically with functional approach:

```javascript
const createMigrilla = require('migrilla');

const migrilla = createMigrilla({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password'
});

// Apply migrations
await migrilla.up();

// Rollback 1 migration (default)
await migrilla.down();

// Rollback 3 migrations
await migrilla.down(3);

// Rollback all applied migrations
await migrilla.down(999);

// Get status
await migrilla.status();

// Close connection
await migrilla.close();
```

### Why Functions Instead of Classes?

- **Immutable Configuration**: Configuration is closed over by functions
- **No State Mutations**: More predictable and testable code
- **Better Performance**: Reduced object instantiation overhead
- **Functional Style**: Clean separation of concerns

### Manual Transaction Control

You can also execute custom operations within transactions:

```javascript
// Transaction API with automatic management
await migrilla.executeInTransaction(async (client) => {
  await client.query('INSERT INTO users (name) VALUES ($1)', ['John']);
  await client.query('UPDATE users SET active = true WHERE name = $1', ['John']);
});
```

## 🛠️ Configuration Options

```javascript
const migrilla = new Migrilla({
  // Database connection options (pg Pool options)
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password',
  
  // Migrilla specific options
  migrationsDir: './migrations',    // Directory with migration files
  stateTable: 'migrilla_state'      // Table name for tracking migrations
});
```

## 🔒 Transaction Safety

Migrilla ensures **atomic execution** of migrations:

- Each migration runs in a **transaction**
- If any part of the migration fails, everything is **rolled back**
- Migration state is updated only after successful execution
- No partial migrations or inconsistent state

This means your database will always be in a consistent state, even if a migration fails halfway through.

📖 **[Read the complete Transaction Guide](TRANSACTION_GUIDE.md)** for detailed information about transaction handling.

📋 **[See API Reference](API_REFERENCE.md)** for complete method documentation.

🚀 **[View all Features](FEATURES.md)** for a comprehensive overview of capabilities.

## 📝 Requirements

- Node.js 18.0.0 or higher
- PostgreSQL database
- Migration files in `migrations/` directory

## 🧪 Testing

```bash
# Run basic tests
npm test

# Run detailed down step tests (requires applied migrations)
npm run test:down-step
```

## 🎉 Key Benefits

- **Zero Dependencies** (except pg module)
- **No Configuration Required** (works with defaults)
- **Production Ready** (atomic operations)
- **Developer Friendly** (beautiful output)
- **Extensible** (programmatic API)
- **Transaction Safe** (automatic rollback on errors)

## 📁 Project Structure

📖 **[See PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** for detailed information about project organization and file descriptions.

📊 **[View PROJECT SUMMARY](SUMMARY.md)** for a complete overview of achievements and implementation details.

🔄 **[Check MIGRATION GUIDE](MIGRATION_GUIDE.md)** for upgrading between versions.

## 🤝 Contributing

Issues and pull requests are welcome!

## 📄 License

MIT 