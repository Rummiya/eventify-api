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

- [x] Добавить swagger документацию

  - [x] `/auth`
  - [x] `/users`
  - [x] `/companies`
  - [x] `/follow`
  - [x] `/events`
  - [x] `/registrations`
  - [x] `/likes`
  - [x] `/comments`

- [ ] Создать prisma seed для

  - [ ] Создания базовых ролей, если те отсутствуют (user, admin, founder, manager)
  - [ ] Создания учетной записи админа

- [ ] Валидировать входные данные через Zod

  - [ ] Создать validateQuery middleware
  - [ ] Написать zod-схемы для query-параметров

- [ ] Функционал админки

  - [x] Добавить схему для ролей
  - [ ] Блокировка/разблокировка пользователей и компаний
  - [ ] Изменение ролей
  - [ ] Просмотр и удаление контента
  - [ ] Назначение овнеров/менеджеров
  - [ ] Аудит — логировать действия, хранить в таблице AuditLog

- [ ] Проверка доступа, создать middleware

  - [ ] isAdmin — проверка user.role.name === 'ADMIN'
  - [ ] isCompanyOwner — проверка в CompanyOwner
  - [ ] isCompanyFounder — проверка CompanyOwner.role === 'FOUNDER'
  - [ ] checkBannedUserOrCompany

- [ ] Интегрировать TypeScript

  - [ ] Протипизировать ВСЕ

- [ ] Добавить локализацию (ru, en)

  - [ ] Добавить обработку локали переданной в url в middleware
  - [ ] Описать все необходимые сообщения
  - [ ] Добавить сообщения исходя из локали в response для всех контроллеров

- [x] Переписать ответы от апи в формат: { data, meta?, message }

  - [x] `/event`

- [ ] Отрефакторить архитектуру проекта
  - [x] Добавить корневую папку src
  - [ ] Вынести запросы из контроллеров в сервисы
  - [x] Сгруппировать контроллеры и сервисы по модулям (user, auth...)
