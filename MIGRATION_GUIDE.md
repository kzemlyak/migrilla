# 🔄 Migration Guide

This guide helps you migrate between versions of Migrilla.

## From v1.0.1 to v1.0.2

### 🔧 API Changes

**Required Action**: Update your code to use factory functions instead of classes.

#### Before (v1.0.1):
```javascript
const Migrilla = require('migrilla');

const migrilla = new Migrilla({
  host: 'localhost',
  database: 'myapp',
  user: 'postgres',
  password: 'secret'
});
```

#### After (v1.0.2):
```javascript
const createMigrilla = require('migrilla');

const migrilla = createMigrilla({
  host: 'localhost',
  database: 'myapp',
  user: 'postgres',
  password: 'secret'
});
```

### 💥 Breaking Changes

- **Constructor**: `new Migrilla(config)` is now `createMigrilla(config)`
- **CLI Internal**: `new MigrillaCLI()` is now `createMigrillaCLI()` (only affects internal code)

### ✅ Benefits of Upgrading

- **Functional Design**: More predictable and testable code
- **Closure-based State**: Immutable configuration and cleaner memory management
- **Better Performance**: Reduced object instantiation overhead

### 🔄 Quick Migration Steps

1. **Update Imports**: Change variable name from `Migrilla` to `createMigrilla`
2. **Update Usage**: Replace `new Migrilla()` with `createMigrilla()`
3. **Test**: Functionality remains identical, just different instantiation

### 📝 Migration Script

```javascript
// Before
const Migrilla = require('migrilla');
const migrilla = new Migrilla(config);

// After  
const createMigrilla = require('migrilla');
const migrilla = createMigrilla(config);

// All methods work exactly the same
await migrilla.up();
await migrilla.down();
await migrilla.status();
await migrilla.close();
```

## From v1.0.0 to v1.0.1

### 🔧 Environment Variables Changes

**Required Action**: Update your environment variables to include the `MIGRILLA_` prefix.

#### Before (v1.0.0):
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secret
DATABASE_URL=postgres://user:pass@host:port/db
DB_SSL=true
```

#### After (v1.0.1):
```bash
MIGRILLA_DB_HOST=localhost
MIGRILLA_DB_PORT=5432
MIGRILLA_DB_NAME=myapp
MIGRILLA_DB_USER=postgres
MIGRILLA_DB_PASSWORD=secret
MIGRILLA_DATABASE_URL=postgres://user:pass@host:port/db
MIGRILLA_DB_SSL=true
```

### 📦 Import Changes

**No Action Required**: If you're importing Migrilla programmatically, the import path remains the same:

```javascript
const Migrilla = require('migrilla'); // Still works
```

The main entry point in `package.json` has been updated to point to `lib/index.js`, but this is transparent to users.

### 🚨 Breaking Changes

- **Environment Variables**: All environment variables now require the `MIGRILLA_` prefix
- **High-level Transaction API**: Removed to simplify the API surface (only callback-style transactions remain)

### ✅ Benefits of Upgrading

- **Namespace Isolation**: Environment variables won't conflict with other tools
- **Cleaner API**: Single transaction approach reduces complexity
- **Better Organization**: Core files moved to `lib/` directory

### 🔄 Quick Migration Steps

1. **Update Environment Variables**: Add `MIGRILLA_` prefix to all your environment variables
2. **Update `.env` files**: Rename all database-related variables
3. **Update CI/CD**: Update deployment scripts with new variable names
4. **Test**: Run `migrilla status` to verify connection still works

### 📝 Example Migration Script

```bash
#!/bin/bash
# migrate-env.sh - Helper script to update environment variables

# Rename variables in .env file
if [ -f ".env" ]; then
    sed -i.backup \
        -e 's/^DB_HOST=/MIGRILLA_DB_HOST=/' \
        -e 's/^DB_PORT=/MIGRILLA_DB_PORT=/' \
        -e 's/^DB_NAME=/MIGRILLA_DB_NAME=/' \
        -e 's/^DB_USER=/MIGRILLA_DB_USER=/' \
        -e 's/^DB_PASSWORD=/MIGRILLA_DB_PASSWORD=/' \
        -e 's/^DATABASE_URL=/MIGRILLA_DATABASE_URL=/' \
        -e 's/^DB_SSL=/MIGRILLA_DB_SSL=/' \
        .env
    echo "✅ Environment variables updated in .env"
fi
```

### 🆘 Need Help?

If you encounter issues during migration:

1. Check the [CHANGELOG.md](CHANGELOG.md) for detailed changes
2. Review the [README.md](README.md) for updated examples
3. Run `migrilla help` to see current CLI options
4. Verify your environment variables with `env | grep MIGRILLA`

### 🔄 Rollback

If you need to rollback to v1.0.0:

```bash
npm install migrilla@1.0.0
```

Then revert your environment variable names back to the old format without the `MIGRILLA_` prefix. 