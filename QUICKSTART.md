# 🚀 Quick Start Guide

Get started with Migrilla in under 5 minutes!

## Step 1: Installation

```bash
npm install migrilla
```

## Step 2: Set Environment Variables

```bash
# .env file or environment variables
MIGRILLA_DB_HOST=localhost
MIGRILLA_DB_PORT=5432
MIGRILLA_DB_NAME=myapp
MIGRILLA_DB_USER=postgres
MIGRILLA_DB_PASSWORD=your_password
```

## Step 3: Create Migration Files

Create a `migrations/` directory and add your first migration:

**migrations/001_create_users_up.sql**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**migrations/001_create_users_down.sql**
```sql
DROP TABLE IF EXISTS users;
```

## Step 4: Run Your First Migration

```bash
# Apply all pending migrations
npx migrilla up

# Check migration status
npx migrilla status

# If needed, rollback the last migration
npx migrilla down
```

## Step 5: Expected Output

```
✅ Migrilla initialized successfully
🔄 Applying migration: 001_create_users
✅ Executed: 001_create_users
🎉 All migrations applied successfully!
```

## That's It! 🎉

You now have:
- ✅ A working migration system
- ✅ Atomic transaction safety
- ✅ Persistent migration tracking
- ✅ Beautiful CLI output

## Next Steps

### Add More Migrations
Create numbered migration files following the pattern:
```
migrations/
├── 001_create_users_up.sql
├── 001_create_users_down.sql
├── 002_add_orders_up.sql
├── 002_add_orders_down.sql
└── 003_add_indexes_up.sql
└── 003_add_indexes_down.sql
```

### Use Programmatically
```javascript
const createMigrilla = require('migrilla');

const migrilla = createMigrilla({
  host: 'localhost',
  database: 'myapp',
  user: 'postgres',
  password: 'your_password'
});

await migrilla.up();
await migrilla.close();
```

### Check Status
```bash
npx migrilla status
```

### Get Help
```bash
npx migrilla help
```

## Common Commands

```bash
# Apply all pending migrations
npx migrilla up

# Rollback last migration
npx migrilla down

# Show migration status
npx migrilla status

# Show help
npx migrilla help
```

## Global Installation (Optional)

```bash
# Install globally for easier usage
npm install -g migrilla

# Now you can use migrilla directly
migrilla up
migrilla status
migrilla down
```

## Environment Variables Reference

```bash
MIGRILLA_DB_HOST=localhost           # Database host
MIGRILLA_DB_PORT=5432               # Database port
MIGRILLA_DB_NAME=myapp              # Database name
MIGRILLA_DB_USER=postgres           # Database user
MIGRILLA_DB_PASSWORD=secret         # Database password
MIGRILLA_DATABASE_URL=postgres://user:pass@host:port/db  # Full connection string
MIGRILLA_DB_SSL=true                # Use SSL connection
```

## Migration File Naming

Follow this pattern for your migration files:
- `NNN_description_up.sql` - Apply migration
- `NNN_description_down.sql` - Rollback migration

Where `NNN` is a zero-padded number (001, 002, etc.)

## Troubleshooting

### Connection Issues
- Check your PostgreSQL server is running
- Verify database credentials
- Test connection manually

### Permission Issues
- Ensure database user has CREATE TABLE permissions
- Check if database exists

### Migration Errors
- Each migration runs in a transaction
- Failed migrations are automatically rolled back
- Check SQL syntax in your migration files

## Documentation

For complete documentation, see:
- [README.md](README.md) - Complete guide
- [API_REFERENCE.md](API_REFERENCE.md) - API documentation
- [TRANSACTION_GUIDE.md](TRANSACTION_GUIDE.md) - Transaction guide
- [FEATURES.md](FEATURES.md) - All features

## Need Help?

- Check the [documentation](README.md)
- Run `npx migrilla help`

Happy migrating! 🦍 