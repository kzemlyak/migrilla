# 🦍 Migrilla

Простая библиотека для миграций PostgreSQL в Node.js приложениях.

## 🚀 Установка

```bash
npm install migrilla
```

## ⚙️ Использование

### Команды

```bash
migrilla up      # Применить все ожидающие миграции
migrilla down    # Откатить последнюю миграцию
migrilla status  # Показать статус миграций
migrilla help    # Показать справку
```

### Переменные окружения

```bash
MIGRILLA_DB_HOST=localhost           # Хост базы данных
MIGRILLA_DB_PORT=5432               # Порт базы данных
MIGRILLA_DB_NAME=myapp              # Имя базы данных
MIGRILLA_DB_USER=postgres           # Пользователь базы данных
MIGRILLA_DB_PASSWORD=mypassword     # Пароль базы данных
MIGRILLA_DATABASE_URL=postgres://user:pass@host:port/db  # Полная строка подключения
MIGRILLA_DB_SSL=true                # Использовать SSL соединение
```

## 💾 Как это работает

✅ Читает SQL файлы из папки `migrations/`  
✅ Отслеживает применённые миграции в таблице `migrilla_state`  
✅ **Атомарное выполнение** - каждая миграция выполняется в транзакции  
✅ Красивый вывод в консоль  
✅ Изящная обработка ошибок  

## 🦍 Файлы миграций

Создавайте файлы миграций в папке `migrations/`:

### Шаблон именования
```
001_название_миграции_up.sql    # Применить миграцию
001_название_миграции_down.sql  # Откатить миграцию
```

### Пример структуры
```
migrations/
├── 001_add_users_table_up.sql
├── 001_add_users_table_down.sql
├── 002_add_orders_table_up.sql
├── 002_add_orders_table_down.sql
└── 003_add_indexes_up.sql
└── 003_add_indexes_down.sql
```

## 📚 Примеры миграций

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

## 🔧 Программное использование

```javascript
const createMigrilla = require('migrilla');

const migrilla = createMigrilla({
  host: 'localhost',
  port: 5432,
  database: 'myapp',
  user: 'postgres',
  password: 'password'
});

// Применить миграции
await migrilla.up();

// Откатить последнюю миграцию
await migrilla.down();

// Показать статус
await migrilla.status();

// Закрыть соединение
await migrilla.close();
```

## 🔄 Управление транзакциями

### Автоматическое управление транзакциями
```javascript
await migrilla.executeInTransaction(async (client) => {
  await client.query('INSERT INTO users (name) VALUES ($1)', ['Иван']);
  await client.query('UPDATE stats SET count = count + 1');
});
```

## 🔒 Безопасность транзакций

Migrilla обеспечивает **атомарное выполнение** миграций:

- Каждая миграция выполняется в **транзакции**
- При любой ошибке происходит **откат** всех изменений
- Состояние миграций обновляется только после успешного выполнения
- Никаких частичных миграций или несогласованных состояний

## 🧪 Тестирование

```bash
npm test         # Основные тесты функциональности
```

## 📝 Требования

- Node.js 18.0.0 или новее
- База данных PostgreSQL
- Файлы миграций в папке `migrations/`

## 🎯 Ключевые особенности

- **Атомарные миграции** - каждая миграция в транзакции
- **Безопасные транзакции** - автоматическое управление с откатом при ошибках
- **Умное обнаружение миграций** - автоматическое обнаружение SQL файлов
- **Постоянное отслеживание состояния** - в таблице базы данных
- **Красивый CLI** - с эмодзи и цветным выводом
- **Поддержка окружения** - переменные окружения
- **Программный API** - для использования в коде
- **Фокус на PostgreSQL** - оптимизирован для PostgreSQL

## 📖 Документация

- [README.md](README.md) - Основная документация (English)
- [README_RU.md](README_RU.md) - Данный файл (русская версия)
- [FEATURES.md](FEATURES.md) - Обзор возможностей
- [API_REFERENCE.md](API_REFERENCE.md) - Полная документация API
- [TRANSACTION_GUIDE.md](TRANSACTION_GUIDE.md) - Руководство по транзакциям
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Структура проекта
- [CHANGELOG.md](CHANGELOG.md) - История версий и изменений
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Руководство по обновлению версий
- [SUMMARY.md](SUMMARY.md) - Итоговый обзор проекта

## 🤝 Вклад в проект

Вопросы и pull request'ы приветствуются!

## 📄 Лицензия

MIT 