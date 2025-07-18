# 📁 Project Structure

```
migrilla/
├── 📦 Core Files
│   ├── package.json              # Package configuration and dependencies
│   ├── lib/
│   │   ├── index.js              # Main Migrilla class with migration logic
│   │   └── cli.js                # CLI interface for command handling
│   └── bin/migrilla.js           # Executable entry point
│
├── 📚 Documentation
│   ├── README.md                 # Main documentation and usage guide
│   ├── README_RU.md              # Russian version of main documentation
│   ├── QUICKSTART.md             # Quick start guide for immediate usage
│   ├── FEATURES.md               # Comprehensive features overview
│   ├── API_REFERENCE.md          # Complete API method documentation
│   ├── TRANSACTION_GUIDE.md      # Detailed transaction API documentation
│   ├── PROJECT_STRUCTURE.md      # This file
│   ├── CHANGELOG.md              # Project history and version changes
│   ├── MIGRATION_GUIDE.md        # Version migration guide
│   └── SUMMARY.md                # Complete project overview and achievements
│
├── 🧪 Testing
│   └── test/test.js              # Basic functionality tests
│
├── 🗃️ Migration Files (example)
│   ├── migrations/
│   │   ├── 001_add_users_table_up.sql
│   │   ├── 001_add_users_table_down.sql
│   │   ├── 002_add_orders_table_up.sql
│   │   ├── 002_add_orders_table_down.sql
│   │   ├── 003_add_user_profile_fields_up.sql
│   │   └── 003_add_user_profile_fields_down.sql
│
└── 🔧 Configuration
    └── .gitignore                # Git ignore patterns
```

## 📦 Core Files

### `package.json`
- Package configuration with dependencies
- CLI binary configuration
- NPM scripts for testing and examples

### `lib/index.js`
- Main `createMigrilla` factory function
- Database connection management using pg Pool
- Migration discovery and execution logic
- Transaction API with callback-style
- State management in `migrilla_state` table
- Functional design with closures

### `lib/cli.js`
- `createMigrillaCLI` factory function
- Environment variable handling
- Command routing (up, down, status, help)
- Error handling and user feedback

### `bin/migrilla.js`
- Executable entry point
- Shebang for direct execution
- Argument parsing and CLI delegation

## 📚 Documentation

### `README.md`
- Installation and usage instructions
- Environment variable configuration
- Example migration files
- Programmatic API usage
- Transaction safety information

### `README_RU.md`
- Russian version of main documentation
- Translated usage instructions
- Localized examples
- Same content as README.md but in Russian

### `QUICKSTART.md`
- Quick start guide for immediate usage
- Step-by-step installation instructions
- First migration examples
- Common commands and troubleshooting
- Get started in under 5 minutes

### `FEATURES.md`
- Comprehensive features overview
- Key capabilities and benefits
- Technical features breakdown
- User experience examples
- Design principles

### `API_REFERENCE.md`
- Complete API method documentation
- Constructor parameters
- All public and internal methods
- Error handling patterns
- Best practices

### `TRANSACTION_GUIDE.md`
- Detailed comparison of transaction approaches
- Performance analysis
- Best practices
- Internal implementation details

### `PROJECT_STRUCTURE.md`
- This file - overview of project organization
- File descriptions and purposes

### `CHANGELOG.md`
- Project history and version changes
- Release notes and feature additions
- Breaking changes and migration guides
- Future roadmap and planned features

### `MIGRATION_GUIDE.md`
- Version migration instructions
- Breaking changes between versions
- Environment variable updates
- Step-by-step upgrade guide
- Rollback procedures

### `SUMMARY.md`
- Complete project overview and achievements
- Technical implementation details
- Statistics and metrics
- Requirements fulfillment analysis
- Final results and conclusions

## 🧪 Testing

### `test/test.js`
- Basic functionality verification
- Database connection testing
- Migration file discovery
- Simple API testing

## 🗃️ Migration Files

Example migration files following the naming convention:
- `NNN_description_up.sql` - Apply migration
- `NNN_description_down.sql` - Rollback migration

Where `NNN` is a zero-padded number (001, 002, etc.)

## 🔧 Configuration

### `.gitignore`
- Standard Node.js ignore patterns
- Environment files
- IDE and OS specific files

## 🚀 Key Features

1. **Atomic Migrations** - Each migration runs in a transaction
2. **Transaction Safety** - Low-level callback-style API for reliable execution
3. **State Tracking** - Persistent migration state in database
4. **Error Handling** - Comprehensive error reporting
5. **Environment Support** - Multiple database connection methods
6. **CLI & Programmatic** - Use via command line or in code
7. **PostgreSQL Only** - Focused on PostgreSQL with pg module

## 🛠️ Dependencies

- **pg** - PostgreSQL client for Node.js
- **Node.js 18+** - Modern JavaScript features
- **PostgreSQL** - Database server

## 📝 NPM Scripts

- `npm test` - Run basic functionality tests 