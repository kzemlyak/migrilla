# Docker Setup для Migrilla

Этот документ описывает как настроить и использовать Docker для тестирования Migrilla.

## Быстрый старт

### 1. Автоматическая настройка (рекомендуется)

```bash
# Запуск полного тестового окружения
npm run test:docker
```

Этот скрипт автоматически:
- Запустит PostgreSQL в Docker
- Создаст `.env` файл из шаблона
- Установит зависимости
- Запустит тесты
- Покажет статус миграций

### 2. Ручная настройка

#### Шаг 1: Создайте .env файл
```bash
cp env.example .env
```

#### Шаг 2: Запустите PostgreSQL
```bash
npm run docker:up
```

#### Шаг 3: Установите зависимости
```bash
npm install
```

#### Шаг 4: Запустите тесты
```bash
npm test
```

## Полезные команды

### Docker команды
```bash
npm run docker:up      # Запустить PostgreSQL
npm run docker:down    # Остановить все сервисы
npm run docker:logs    # Просмотр логов PostgreSQL
```

### Миграции
```bash
npm run migrate:up     # Применить все миграции
npm run migrate:down   # Откатить последнюю миграцию
npm run migrate:status # Показать статус миграций
```

### Тестирование
```bash
npm test               # Запустить тесты
npm run test:docker    # Полное тестовое окружение
```

## Структура файлов

```
migrilla/
├── docker-compose.yml     # Конфигурация Docker
├── env.example           # Шаблон переменных окружения
├── scripts/
│   └── test-docker.sh   # Скрипт автоматической настройки
└── DOCKER_SETUP.md      # Этот файл
```

## Конфигурация

### Переменные окружения (.env)

Переменные окружения автоматически загружаются из `.env` файла с помощью библиотеки `dotenv`.

```env
# Database Configuration
MIGRILLA_DB_HOST=localhost
MIGRILLA_DB_PORT=5432
MIGRILLA_DB_NAME=test_migrilla
MIGRILLA_DB_USER=postgres
MIGRILLA_DB_PASSWORD=postgres

# Optional: Full connection string
# MIGRILLA_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test_migrilla

# Environment
NODE_ENV=development
```

### Docker Compose

- **PostgreSQL 15**: Основная база данных для тестирования
- **pgAdmin**: Веб-интерфейс для управления базой данных (опционально)
  - URL: http://localhost:8080
  - Email: admin@migrilla.com
  - Password: admin

## Troubleshooting

### Проблема: Docker не запущен
```bash
# Проверьте статус Docker
docker info

# Запустите Docker Desktop или Docker daemon
```

### Проблема: Порт 5432 занят
```bash
# Измените порт в docker-compose.yml
ports:
  - "5433:5432"  # Используйте другой порт
```

### Проблема: Не удается подключиться к базе данных
```bash
# Проверьте логи PostgreSQL
npm run docker:logs

# Перезапустите контейнеры
npm run docker:down
npm run docker:up
```

### Проблема: Миграции не применяются
```bash
# Проверьте статус
npm run migrate:status

# Примените миграции заново
npm run migrate:up
```

## Очистка

```bash
# Остановить все сервисы и удалить данные
docker-compose down -v

# Удалить образы
docker-compose down --rmi all
``` 