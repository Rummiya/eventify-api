## 📋 ToDo

_Прогресс: 45 из 71 задач выполнено (63%)_ ✅

1. - [x] 🔌 Подключить MongoDB и Prisma  
  1.1. - [x] Создать базу данных  
  1.2. - [x] Настроить `.env`  
  1.3. - [x] Провести `prisma db push` и `generate`

2. - [x] 🧱 Переписать/прописать Prisma-схемы  
  2.1. - [x] User  
  2.2. - [x] Event  
  2.3. - [x] Like  
  2.4. - [x] Comment  
  2.5. - [x] Registration  
  2.6. - [x] Company  
  2.7. - [x] CompanyFollow  
  2.8. - [x] CompanyOwner

3. - [x] 🧠 Создать контроллеры  
  3.1. - [x] User (register, login, current, getAllUsers, getByUserId)  
  3.2. - [x] Company (crud)  
  3.3. - [x] Event (crud)  
  3.4. - [x] Registration (register, unregister)  
  3.5. - [x] Like (like, unlike)  
  3.6. - [x] Comment (crud)  
  3.7. - [x] CompanyFollow (follow, unfollow)  
  3.8. - [ ] CompanyOwner (crud)

4. - [x] Добавить фильтры для  
  4.1. - [x] GET Users (по ролям, имени, дате регистрации)  
  4.2. - [x] GET Events (по категории, городу, ближайшие, лайкнутые)

5. - [x] 🛣️ Переписать/написать маршруты  
  5.1. - [x] `/api/auth`  
  5.2. - [x] `/api/users`  
  5.3. - [x] `/api/events`  
  5.4. - [x] `/api/registrations`  
  5.5. - [x] `/api/companies`

6. - [x] Перейти с CommonJS на ES Modules

7. - [x] Добавить swagger документацию  
  7.1. - [x] `/auth`  
  7.2. - [x] `/users`  
  7.3. - [x] `/companies`  
  7.4. - [x] `/follow`  
  7.5. - [x] `/events`  
  7.6. - [x] `/registrations`  
  7.7. - [x] `/likes`  
  7.8. - [x] `/comments`

8. - [ ] Создать prisma seed для  
  8.1. - [ ] Создания базовых ролей, если те отсутствуют (user, admin, founder, manager)  
  8.2. - [ ] Создания учетной записи админа

9. - [ ] Валидировать входные данные через Zod  
  9.1. - [ ] Создать validateQuery middleware  
  9.2. - [ ] Написать zod-схемы для query-параметров

10. - [ ] Функционал админки  
  10.1. - [x] Добавить схему для ролей  
  10.2. - [ ] Блокировка/разблокировка пользователей и компаний  
  10.3. - [ ] Изменение ролей  
  10.4. - [ ] Просмотр и удаление контента  
  10.5. - [ ] Назначение овнеров/менеджеров  
  10.6. - [ ] Аудит — логировать действия, хранить в таблице AuditLog

11. - [ ] Проверка доступа, создать middleware  
  11.1. - [ ] isAdmin — проверка user.role.name === 'ADMIN'  
  11.2. - [ ] isCompanyOwner — проверка в CompanyOwner  
  11.3. - [ ] isCompanyFounder — проверка CompanyOwner.role === 'FOUNDER'  
  11.4. - [ ] checkBannedUserOrCompany

12. - [ ] Интегрировать TypeScript  
  12.1. - [ ] Протипизировать ВСЕ

13. - [ ] Добавить локализацию (ru, en)  
  13.1. - [ ] Добавить обработку локали переданной в url в middleware  
  13.2. - [ ] Описать все необходимые сообщения  
  13.3. - [ ] Добавить сообщения исходя из локали в response для всех контроллеров

14. - [x] Переписать ответы от апи в формат: `{ data, meta?, message }`  
  14.1. - [x] `/event`

15. - [ ] Отрефакторить архитектуру проекта  
  15.1. - [x] Добавить корневую папку `src`  
  15.2. - [ ] Вынести запросы из контроллеров в сервисы  
  15.3. - [x] Сгруппировать контроллеры и сервисы по модулям (user, auth...)
