# Опис гілки для майбутнього розробника

Цей документ описує структуру гілки, організацію коду, особливості реалізації та труднощі, з якими я зіткнувся під час розробки. Він створений для майбутнього мене або іншого розробника, щоб швидко розібратися в проєкті.

---

## 1. Огляд проєкту

Гілка реалізує сторінку керування користувачами для адмін-панелі (`/admin/users`). Адміністратори можуть переглядати список користувачів, редагувати їх дані та позначати як видалених. Використовується серверний рендеринг (SSR) для завантаження даних і клієнтські компоненти для інтерактивності (фільтрація, пагінація, редагування).

### Основні компоненти

- **Сторінка**: `src/app/admin/users/page.jsx` — завантаження даних і відображення таблиці.
- **Таблиця**: `src/components/admin/users/UsersTable.jsx` — клієнтський компонент із `@tanstack/react-table` для роботи з даними.
- **API**: `src/app/api/admin/users/[id]/route.js` — ендпоїнти для оновлення (`PUT`) та видалення (`DELETE`).
- **Утиліти**: `src/utils/db/users.js` — функції для роботи з MongoDB.

---

## 2. Структура проєкту

Проєкт побудований на **Next.js (App Router)** із автентифікацією через `next-auth` і базою даних **MongoDB**.

### Ключові файли

- **Сторінки**:
  - `src/app/admin/users/page.jsx` — сторінка користувачів (SSR).
  - `src/app/api/admin/users/[id]/route.js` — API для оновлення/видалення.
- **Компоненти**:
  - `src/components/admin/users/UsersTable.jsx` — таблиця з інтерактивністю.
- **Утиліти**:
  - `src/utils/db.js` — підключення до MongoDB.
  - `src/utils/db/users.js` — методи для роботи з користувачами.
  - `src/auth.js` — конфігурація `next-auth`.
  - `src/middleware.js` — захист маршрутів.
- **Моделі**:
  - `src/models/User.js` — схема користувача.

### Взаємодія

1. Сторінка `/admin/users` викликає `getUsers` із `src/utils/db/users.js` і передає дані в `UsersTable`.
2. `UsersTable` відображає таблицю, підтримує фільтрацію, пагінацію та редагування через API-запити.

---

## 3. Реєстрація нових користувачів

Реєстрація реалізована через `next-auth` із підтримкою Google і Credentials (email/пароль).

### Де шукати код

- **Конфігурація**: `src/auth.js` — налаштування провайдерів і сесій.
- **Сторінка**: `src/app/auth/signin/page.jsx` — UI для входу/реєстрації.
- **Логіка**: У `src/auth.js` callback `signIn` обробляє створення нових користувачів (наприклад, при вході через Google).

### Як працює

- **Credentials**: Користувач вводить email/пароль, `next-auth` перевіряє їх.
- **Google**: При першому вході автоматично створюється запис у БД (якщо налаштовано).

---

## 4. Підключення до бази даних

Підключення до MongoDB налаштовано в `src/utils/db.js`:

```javascript
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
```

- У `development` підключення кешується через `global`.
- Методи для роботи з користувачами (отримання, оновлення) — у `src/utils/db/users.js`.

---

## 5. Блокування URL і автентифікація

Автентифікація реалізована через `next-auth`, а маршрути захищені через middleware.

### Налаштування

- **Конфігурація**: `src/auth.js` — провайдери, сесії, callbacks.
- **Middleware**: `src/middleware.js` — перевірка ролей для `/admin/*`.

### Як працює захист

- Middleware перевіряє токен і роль користувача.
- Якщо роль не `admin` або користувач не автентифікований, перенаправляє на `/login`.
- Додаткова серверна перевірка в `page.jsx`:

  ```jsx
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }
  ```

---

## 6. Труднощі та їх вирішення

Під час розробки виникли такі проблеми:

### Проблема з `searchParams` і `params`

- У Next.js 15.2.3 ці параметри можуть бути промісами.
- **Вирішення**: Додано `await` у `page.jsx` і `route.js`.

### HTML замість JSON у API

- Ендпоїнт був у `src/app/...` замість `src/app/api/...`.
- **Вирішення**: Перенесено в правильну директорію.

### Порожнє `name` при оновленні

- Поле `name` перезаписувалося порожнім рядком.
- **Вирішення**: Додано перевірку в `handleSave` і `route.js`.

### Проблеми з автентифікацією

- Cookie (`authjs.session-token`) некоректно читалися в middleware.
- **Вирішення**: Використано динамічне ім’я cookie залежно від `NODE_ENV`.

---

## 7. Інструкція з використання

### Запуск

1. Встанови залежності: `npm install`.
2. Запусти: `npm run dev`.
3. Перейди на `http://localhost:3000/admin/users` (автентифікуйся як `admin`).

### Робота з таблицею

- Фільтруй за ім’ям/email.
- Перемикай сторінки.
- Редагуй інлайн (ім’я, роль, статус).
- Видаляй через 🗑️.

### API

- `PUT /api/admin/users/[id]` — оновлення.
- `DELETE /api/admin/users/[id]` — позначення як видаленого.

### На що звернути увагу

- **Асинхронність**: Завжди використовуй `await` для `searchParams` і `params`.
- **API**: Переконайся, що ендпоїнти в `src/app/api/...`.
- **Логи**: Прибери `console.log` перед мерджем.

---

## 8. Наступні кроки

- Додати сортування колонок у таблиці.
- Реалізувати кешування сесій (Redis/Vercel Edge Config).
- Покращити стилі таблиці (TailwindCSS).
- Перевірити крайові випадки редагування/видалення.

---

### Структура роутів
Next.js App Router автоматично створює маршрути на основі структури папок у `src/app`. Ось розшифровка твоїх маршрутів:

#### Сторінки (Page Routes)
- **`/`**: `page.js` — головна сторінка.
- **`/admin`**: `admin/page.jsx` — адмін-панель.
- **`/admin/documents`**: `admin/documents/page.jsx` — сторінка адмінки для документів.
- **`/admin/news`**: `admin/news/page.jsx` — сторінка адмінки для новин.
- **`/admin/users`**: `admin/users/page.jsx` — сторінка адмінки для користувачів.
- **`/contacts`**: `contacts/page.jsx` — сторінка контактів.
- **`/dashboard`**: `dashboard/page.jsx` — дашборд.
- **`/documents`**: `documents/page.jsx` — сторінка документів.
- **`/forgot-password`**: `forgot-password/page.jsx` — сторінка для скидання пароля.
- **`/login`**: `login/page.jsx` — сторінка входу.
- **`/news`**: `news/page.jsx` — сторінка новин.
- **`/register`**: `register/page.jsx` — сторінка реєстрації.
- **`/reset-password`**: `reset-password/page.jsx` — сторінка для зміни пароля.
- **`/reset-password/request`**: `reset-password/request/page.jsx` — сторінка для запиту зміни пароля.
- **`/signin`**: `signin/page.jsx` — сторінка входу (можливо, дубль із `/login`).

#### API-роути (API Routes)
- **`/api/admin/users/[id]`**: `api/admin/users/[id]/route.js` — `PUT` для оновлення користувача, `DELETE` для позначки видалення.
- **`/api/auth/add-password`**: `api/auth/add-password/route.js` — додає пароль.
- **`/api/auth/logout`**: `api/auth/logout/route.js` — вихід із системи.
- **`/api/auth/register`**: `api/auth/register/route.js` — реєстрація.
- **`/api/auth/[...nextauth]`**: `api/auth/[...nextauth]/route.js` — NextAuth.js роути для автентифікації.
- **`/api/documents`**: `api/documents/route.js` — `GET` для отримання документів, `POST` для додавання.
- **`/api/documents/upload`**: `api/documents/upload/route.js` — завантаження документів.
- **`/api/documents/[id]`**: `api/documents/[id]/route.js` — `PATCH` для оновлення документа.
- **`/api/forgot-password`**: `api/forgot-password/route.js` — запит на скидання пароля.
- **`/api/reset-password`**: `api/reset-password/route.js` — зміна пароля.
- **`/api/users`**: `api/users/route.js` — `POST` для створення користувача.

---

### Чому плутанина
- Є дубльовані роути для автентифікації: `/login` і `/signin`. Це може створювати плутанину.
- API-роути для документів (`/api/documents`, `/api/documents/[id]`, `/api/documents/upload`) мають схожі назви, але різні методи (`GET`, `POST`, `PATCH`).
- Сторінки адмінки (`/admin/documents`, `/admin/users`) і API-роути (`/api/documents`, `/api/admin/users/[id]`) мають схожі назви, але різні призначення.

---

### Рекомендації
1. **Об’єднай `/login` і `/signin`**:
   - Вибери один роут (наприклад, `/login`) і видали інший (`signin/page.jsx`).

2. **Додай логування для розмежування**:
   - У `api/documents/route.js` додай:
     ```javascript
     console.log("📥 Обробка GET/POST /api/documents");
     ```
   - У `api/documents/[id]/route.js`:
     ```javascript
     console.log("📝 Обробка PATCH /api/documents/[id]", id);
     ```

3. **Перевір виклики**:
   - У `admin/documents/page.jsx` ти викликаєш `PATCH /api/documents/[id]` через `handleUpdate`. Переконайся, що `fetchWithAuth` правильно формує URL.

---

### Наступні кроки
- Перевір дублі `/login` і `/signin`.
- Додай логування в API-роути.
- Перевір запити до `/api/documents`.

Готовий?