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
  - [x] Companies (crud)
  - [x] Events (crud)
  - [ ] Registrations (register, unregister)
  - [x] Like (like, unlike)
  - [x] Comment (crud)
  
- [x] Добавить фильтры для
  - [x] GET Users (по ролям, имени, дате регистрации) 
  - [x] GET Events (по категории, городу, ближайщие, лайкнутые) 

- [x] 🛣️ Переписать/написать маршруты
  - [x] `/api/auth`
  - [x] `/api/users`
  - [x] `/api/events`
  - [ ] `/api/registrations`
  - [x] `/api/companies`
     
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
