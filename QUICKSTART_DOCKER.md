# 🐳 Быстрый старт с Docker

## 1. Подготовка

Убедитесь, что у вас установлен Docker и Docker Compose.

## 2. Настройка окружения

```bash
# Создать .env файл из шаблона
npm run setup:env

# Или вручную
cp env.example .env
```

## 3. Запуск тестового окружения

```bash
# Автоматический запуск всего (рекомендуется)
npm run test:docker
```

Этот скрипт автоматически:
- ✅ Запустит PostgreSQL в Docker
- ✅ Создаст .env файл
- ✅ Установит зависимости
- ✅ Запустит тесты
- ✅ Покажет статус миграций

## 4. Ручной запуск

```bash
# Запустить PostgreSQL
npm run docker:up

# Установить зависимости
npm install

# Запустить тесты
npm test

# Применить миграции
npm run migrate:up

# Проверить статус
npm run migrate:status
```

## 5. Полезные команды

```bash
# Docker
npm run docker:up      # Запустить PostgreSQL
npm run docker:down    # Остановить все сервисы
npm run docker:logs    # Просмотр логов

# Миграции
npm run migrate:up     # Применить миграции
npm run migrate:down   # Откатить последнюю
npm run migrate:status # Статус миграций

# Тестирование
npm test               # Запустить тесты
npm run test:docker    # Полное окружение
```

## 6. Веб-интерфейс (опционально)

Если вы запустили pgAdmin в docker-compose:

- **URL**: http://localhost:8080
- **Email**: admin@migrilla.com
- **Password**: admin

## 7. Очистка

```bash
# Остановить и удалить контейнеры
npm run docker:down

# Удалить данные
docker-compose down -v
```

---

🎉 **Готово!** Теперь у вас есть полноценное тестовое окружение для Migrilla с PostgreSQL в Docker. 