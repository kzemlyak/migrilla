# 📝 Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2024-01-01

### 🔧 Changed
- **API Design**: Replaced classes with factory functions for more functional approach
  - `new Migrilla()` → `createMigrilla()`
  - `new MigrillaCLI()` → `createMigrillaCLI()`
- **Functional Design**: Pure functions with closures for state management
- **Immutable Configuration**: Configuration passed once and closed over by functions

### 💥 Breaking Changes
- **Constructor**: `new Migrilla(config)` is now `createMigrilla(config)`
- **Import**: Still `const createMigrilla = require('migrilla')` but usage changed

## [1.0.1] - 2024-01-01

### 🔧 Changed
- **Environment Variables**: Added `MIGRILLA_` prefix to all environment variables for better namespace isolation
  - `DB_HOST` → `MIGRILLA_DB_HOST`
  - `DB_PORT` → `MIGRILLA_DB_PORT`
  - `DB_NAME` → `MIGRILLA_DB_NAME`
  - `DB_USER` → `MIGRILLA_DB_USER`
  - `DB_PASSWORD` → `MIGRILLA_DB_PASSWORD`
  - `DATABASE_URL` → `MIGRILLA_DATABASE_URL`
  - `DB_SSL` → `MIGRILLA_DB_SSL`

### 🏗️ Internal
- **Project Structure**: Moved core files to `lib/` directory
  - `index.js` → `lib/index.js`
  - `cli.js` → `lib/cli.js`
- **Simplified API**: Removed high-level transaction API, keeping only callback-style for simplicity

## [1.0.0] - 2024-01-01

### 🎉 Initial Release

#### ✨ Added
- **Core Migration System**
  - Automatic SQL file discovery and execution
  - Up/down migration support with naming convention
  - Persistent state tracking in database table
  - Atomic transaction-based execution

- **Dual Transaction APIs**
  - High-level API with explicit transaction objects
  - Low-level API with callback-style automatic management
  - Both approaches with identical performance

- **CLI Interface**
  - `migrilla up` - Apply all pending migrations
  - `migrilla down` - Rollback last migration
  - `migrilla status` - Show migration status
  - `migrilla help` - Show help information

- **Environment Configuration**
  - Support for environment variables
  - DATABASE_URL connection string support
  - SSL configuration options
  - Flexible database connection methods

- **Programmatic API**
  - Full Node.js integration support
  - Custom transaction handling
  - Connection pool management
  - Comprehensive error handling

- **PostgreSQL Integration**
  - Optimized for PostgreSQL using pg module
  - Connection pooling via pg.Pool
  - Modern async/await patterns
  - Parameterized queries for security

#### 🔧 Technical Features
- **Migration Discovery**: Automatic SQL file parsing with regex matching
- **State Management**: Persistent tracking in `migrilla_state` table
- **Error Handling**: Comprehensive error reporting and transaction rollback
- **File System**: Flexible directory structure support
- **Connection Management**: Automatic connection pooling and cleanup

#### 📚 Documentation
- **README.md**: Complete usage guide and examples
- **README_RU.md**: Russian version of main documentation
- **FEATURES.md**: Comprehensive features overview
- **API_REFERENCE.md**: Complete API method documentation
- **TRANSACTION_GUIDE.md**: Detailed transaction API comparison
- **PROJECT_STRUCTURE.md**: Project organization documentation

#### 🧪 Testing & Examples
- **test/test.js**: Basic functionality verification
- **examples/advanced-usage.js**: Programmatic API demonstrations
- **examples/transaction-comparison.js**: Transaction approach comparison
- **NPM scripts**: Test, example, and comparison commands

#### 🎨 User Experience
- **Beautiful CLI**: Emoji-rich output with clear progress indicators
- **Error Messages**: Descriptive error reporting with helpful suggestions
- **Status Display**: Detailed migration status with summary statistics
- **Help System**: Comprehensive help and usage information

#### 🔒 Security & Reliability
- **Atomic Operations**: Each migration runs in a database transaction
- **State Consistency**: No partial migrations or inconsistent states
- **Error Recovery**: Automatic rollback on failures
- **Connection Safety**: Proper connection pool management

#### 📦 Dependencies
- **pg**: PostgreSQL client for Node.js (only external dependency)
- **Node.js 18+**: Modern JavaScript features and async/await support

#### 🎯 Design Principles
- **Simplicity**: Easy to understand and use
- **Reliability**: Atomic operations and comprehensive error handling
- **Flexibility**: Multiple APIs for different use cases
- **Performance**: Efficient connection pooling and transaction management
- **Transparency**: Clear output and detailed error messages
- **PostgreSQL Focus**: Optimized specifically for PostgreSQL

### 🚀 Key Achievements
- Zero-configuration setup with sensible defaults
- Production-ready atomic migration execution
- Comprehensive documentation and examples
- Dual transaction APIs for different developer preferences
- Beautiful CLI interface with developer-friendly output
- Complete test coverage and example implementations

---

## Future Releases

Future versions will be documented here as they are released.

### Planned Features
- Migration rollback to specific version
- Migration verification and validation
- Custom migration templates
- Migration performance metrics
- Integration with popular Node.js frameworks 