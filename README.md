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
- **TypeScript** — типизация
- **Prisma ORM** — взаимодействие с базой данных
- **MongoDB** — база данных
- **Zod** — валидация данных
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

- [ ] 🧠 Создать контроллеры
  - [ ] User (register, login, current, getAllUsers, getByUserId)
  - [ ] Companies (crud)
  - [ ] Events (crud)
  - [ ] Registrations (register, unregister)
  - [ ] Like (like, unlike)
  - [ ] Comment (crud)
  
- [ ] Добавить фильтры для
  - [ ] GET Users (по ролям, имени, дате регистрации) 
  - [ ] GET Events (по категории, городу, ближайщие, лайкнутые) 

- [ ] 🛣️ Переписать маршруты
  - [ ] `/api/users`
  - [ ] `/api/events`
  - [ ] `/api/registrations`
  - [ ] `/api/companies`
  - [ ] ...


