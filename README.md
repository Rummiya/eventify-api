# ⚙️ Eventify API

### Серверная часть приложения Eventify

## 🎯 Цель проекта

Создать полноценный backend для работы с мероприятиями и пользователями, с поддержкой:

- CRUD для событий,
- регистрации пользователей и аутентификации (JWT),
- регистрации пользователей на мероприятия,
- авторизации и проверки прав доступа (создатель / участник),
- масштабируемой структуры с Prisma и MongoDB.
- ...

---

## 🧩 Стек технологий

- **Node.js**, **Express** — сервер
- **Prisma ORM** — взаимодействие с базой данных
- **TypeScript**
- **MongoDB** — база данных
- **JWT** — аутентификация
- **dotenv** — переменные окружения
- **CORS**, **helmet**, **morgan** — безопасность и логгирование

---

## 📋 ToDo

- [x] 🔌 Подключить MongoDB и Prisma

  - [x] Создать базу данных
  - [x] Настроить `.env`
  - [x] Провести `prisma db push` и `generate`

- [x] 🧱 Переписать/прописать Prisma-схемы

  - [x] User
  - [x] Event
  - [x] Like
  - [x] Comment
  - [x] Registration
  - [x] Company
  - [x] CompanyFollow
  - [x] CompanyOwner

- [x] 🧠 Создать контроллеры

  - [x] User (register, login, current, getAllUsers, getByUserId)
  - [x] Company (crud)
  - [x] Event (crud)
  - [x] Registration (register, unregister)
  - [x] Like (like, unlike)
  - [x] Comment (crud)
  - [x] CompanyFollow (follow, unfollow)
  - [ ] CompanyOwner (crud)

- [x] Добавить фильтры для

  - [x] GET Users (по ролям, имени, дате регистрации)
  - [x] GET Events (по категории, городу, ближайшие, лайкнутые)

- [x] 🛣️ Переписать/написать маршруты

  - [x] `/api/auth`
  - [x] `/api/users`
  - [x] `/api/events`
  - [x] `/api/registrations`
  - [x] `/api/companies`

- [x] Перейти с CommonJS на ES Modules

- [ ] Добавить swagger документацию

  - [ ] `/auth`
  - [ ] `/users`
  - [ ] `/events`
  - [ ] `/registrations`
  - [ ] `/companies`
  - [ ] `/likes`
  - [ ] `/comments`

- [ ] Интегрировать TypeScript

  - [ ] Протипизировать ВСЕ

- [ ] Добавить локализацию (ru, en)

  - [ ] Добавить обработку локали переданной в url в middleware
  - [ ] Описать все необходимые сообщения
  - [ ] Добавить сообщения исходя из локали в response для всех контроллеров

- [ ] Переписать ответы от апи в формат: { data, meta?, message }

- [ ] Отрефакторить архитектуру проекта
  - [x] Добавить корневую папку src
  - [ ] Вынести запросы из контроллеров в сервисы
  - [ ] Сгруппировать контроллеры и сервисы по модулям (user, auth...)
