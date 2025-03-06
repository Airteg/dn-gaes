## Файл `.env.local` кілька важливих моментів щодо безпеки:

1. **Безпека MONGODB_URI**  
   - **Не зберігайте відкритий пароль у `.env.local` у репозиторії!**  
   - Додайте `.env.local` у `.gitignore`, якщо ще не зробили.
   - Краще використовувати змінну для пароля:  
     ```
     MONGODB_USER=airteg
     MONGODB_PASSWORD=GfjkmLkzLjcnege1
     MONGODB_URI=mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.91jb4.mongodb.net/dn-gaes?retryWrites=true&w=majority&appName=Cluster0
     ```

2. **STORAGE_PATH**  
   - Вказує папку, де зберігаються документи. Якщо файли у `public/storage`, доступ до них буде `http://localhost:3000/storage/...`.

3. **NEXT_PUBLIC_BASE_URL**  
   - `NEXT_PUBLIC_` означає, що змінна доступна на фронтенді. Якщо не потрібно передавати її у браузер, видаліть `NEXT_PUBLIC_`.

### Додаткові рекомендації:
- Якщо плануєте деплой, збережіть `.env` змінні в сервісі, де розгорнете Next.js (наприклад, Vercel або сервері).
- Для локального запуску `.env.local` достатньо, але на продакшені використовуйте `.env.production`.

Файл `.gitignore` має містити:
```
.env.local
.env.development
.env.production
```

## **Налаштування підключення до MongoDB**  

1. **Створіть файл підключення**  
   У папці  `src/utils/` створіть файл **`db.js`**:

2. **Додайте код підключення**  
   ```javascript
   import mongoose from 'mongoose';

   const MONGODB_URI = process.env.MONGODB_URI;

   if (!MONGODB_URI) {
      throw new Error('❌ MONGODB_URI is not defined in .env.local');
      }
      let cached = global.mongoose;
      if (!cached) {
         cached = global.mongoose = { conn: null, promise: null };
         }
   async function connectToDatabase() {
      if (cached.conn) {
        return cached.conn;
        }
      if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
         // Вказати назву бази даних
         dbName: 'dn-gaes',
         }).then((mongoose) => mongoose);
         }
         
      cached.conn = await cached.promise;
      return cached.conn;
   }

   export default connectToDatabase;

   ```

3. **Що цей код робить?**
   - Перевіряє, чи є `MONGODB_URI` в `.env.local`.
   - Використовує кешування (`global.mongoose`), щоб уникнути повторного підключення у Next.js (бо він перезапускає сервер при кожному запиті в `dev`-режимі).
   - Встановлює параметри `useNewUrlParser` та `useUnifiedTopology` для стабільного з’єднання.

4. **Перевірка підключення**  
   - Додайте виклик `connectToDatabase()` у `src/app/layout.js` (тимчасово, для тесту):  
     ```javascript
     import connectToDatabase from '@/lib/db';

     export default async function Layout({ children }) {
         await connectToDatabase();
         return <>{children}</>;
     }
     ```
   - Запустіть `pnpm dev` і перевірте, чи немає помилок у консолі.

## **Створення моделей MongoDB (`User`, `Document`)**  

📌 **Створіть папку `src/models/`**  
У ній будуть моделі для роботи з MongoDB.

---

### **1. Модель користувача (`User.js`)**  
📌 **Створіть файл `src/models/User.js`**  
```javascript
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
    status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
```
📌 **Поля:**
- `email` — унікальний email.
- `password` — захешований пароль.
- `name` — ім'я користувача.
- `role` — роль (`user`, `moderator`, `admin`).
- `status` — статус реєстрації (`pending`, `active`, `rejected`).
- `timestamps` — автоматично додає `createdAt` та `updatedAt`.

---

### **2. Модель документа (`Document.js`)**  
📌 **Створіть файл `src/models/Document.js`**  
```javascript
import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);
```
📌 **Поля:**
- `title` — назва документа.
- `filePath` — шлях до файлу (`/public/storage/...`).
- `uploadedBy` — ID користувача, який завантажив документ (з посиланням на `User`).

---

### **Перевірка роботи моделей**  
📌 **Створіть API-роут для перевірки підключення (`src/app/api/test/route.js`)**
```javascript
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    await connectToDatabase();

    const users = await User.find({});
    return NextResponse.json({ users });
}
```
✅ **Перевірте в браузері:** `http://localhost:3000/api/test`  
Якщо все правильно, має повернутися `[]` (порожній масив, бо ще немає користувачів).

---

## Встановіть **Mongoose** через `pnpm`:  

```sh
pnpm add mongoose
```

Після встановлення можна перевірити, чи він є в `package.json` у розділі `dependencies`.  

## **Реалізація API реєстрації користувачів (`/api/auth/register`)**  

📌 **Створіть файл `src/app/api/auth/register/route.js`**  
```javascript
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, password, firstName, lastName, nickname, position, placeOfWork } = await req.json();

    // Перевірка, чи існує користувач із таким email або nickname
    const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
    if (existingUser) {
      return NextResponse.json({ error: "Користувач із таким email або nickname вже існує" }, { status: 400 });
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача зі статусом "pending"
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      nickname,
      position,
      placeOfWork,
      role: "user",
      status: "pending",
    });

    return NextResponse.json({ message: "Користувача зареєстровано. Очікуйте підтвердження адміністратора." }, { status: 201 });
  } catch (error) {
    console.error("Помилка реєстрації:", error);
    return NextResponse.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}
```

---

### **🔍 Як це працює?**
1. **Підключення до бази** через `connectToDatabase()`.
2. **Отримання даних** з `req.json()`.
3. **Перевірка, чи є email або nickname в базі** (`findOne({ $or: [{ email }, { nickname }] })`).
4. **Хешування пароля** перед збереженням (`bcrypt.hash(password, 10)`).
5. **Створення нового користувача** з `status: "pending"`.
6. **Відповідь** `"Очікуйте підтвердження адміністратора"` (адмін має активувати користувача).

---

### **✅ Тест реєстрації**
Запустіть сервер:
```sh
pnpm dev
```
Потім **відправте POST-запит** на `http://localhost:3000/api/auth/register` через Postman або `fetch`:
```json
{
  "email": "test@example.com",
  "password": "securepassword",
  "firstName": "Іван",
  "lastName": "Петров",
  "nickname": "IvanPetrov",
  "position": "Менеджер",
  "placeOfWork": "ТОВ Компанія"
}
```

## `bcryptjs` — бібліотека для **хешування паролів** у JavaScript.  

### **Навіщо вона потрібна?**  
Коли користувач реєструється, ми **не можемо зберігати пароль у відкритому вигляді** з міркувань безпеки.  
`bcryptjs` дозволяє:
- **Хешувати пароль** перед збереженням у базі.  
- **Перевіряти пароль при вході**, порівнюючи хеш із введеним паролем.  

---

### **Як встановити `bcryptjs`?**
```sh
pnpm add bcryptjs
```
📌 Якщо використовуєте `npm`, то:
```sh
npm install bcryptjs
```

---

### **Як він працює?**
#### **1️⃣ Хешування пароля при реєстрації**
```javascript
import bcrypt from "bcryptjs";

const password = "mySecurePassword";
const hashedPassword = await bcrypt.hash(password, 10); // 10 - рівень складності (salt rounds)
console.log(hashedPassword); // Виведе щось типу "$2a$10$X..."

```

#### **2️⃣ Перевірка пароля при вході**
```javascript
const isMatch = await bcrypt.compare("mySecurePassword", hashedPassword);
console.log(isMatch); // true або false
```

---

📌 `bcryptjs` працює повністю на **JavaScript**, тому швидше встановлюється і не потребує додаткових залежностей, на відміну від `bcrypt`, який потребує нативних модулів.  

✅ Встановіть `bcryptjs`, і реєстрація буде працювати коректно! 🚀

## **Реалізація API авторизації (`/api/auth/login`)**  

📌 **Створіть файл `src/app/api/auth/login/route.js`**  
```javascript
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    // Перевіряємо, чи є такий користувач
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Невірний email або пароль" }, { status: 401 });
    }

    // Перевіряємо, чи користувач підтверджений адміном
    if (user.status !== "active") {
      return NextResponse.json({ error: "Ваш акаунт ще не активовано" }, { status: 403 });
    }

    // Перевірка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Невірний email або пароль" }, { status: 401 });
    }

    // Генеруємо JWT токен
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Термін дії токена 7 днів
    );

    return NextResponse.json({ token, message: "Вхід успішний" }, { status: 200 });
  } catch (error) {
    console.error("Помилка входу:", error);
    return NextResponse.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}
```

---

### **🛠 Що потрібно зробити перед тестуванням?**
1. **Додайте в `.env.local` секретний ключ для JWT:**
   ```
   JWT_SECRET=your_super_secret_key
   ```
   (Змініть `your_super_secret_key` на щось складне, можна згенерувати `openssl rand -base64 32`)

2. **Перезапустіть сервер Next.js:**
   ```sh
   pnpm dev
   ```

---

### **✅ Як це працює?**
1. **Шукає користувача в базі** по email.
2. **Перевіряє статус** (чи активований акаунт).
3. **Перевіряє пароль**, порівнюючи з хешем у базі.
4. **Генерує JWT токен**, якщо все правильно.
5. **Повертає токен** клієнту (його потрібно зберігати на фронті).

---

### **🚀 Тестуємо вхід**
📌 Відправте **POST-запит** на `http://localhost:3000/api/auth/login` з даними:
```json
{
  "email": "test@example.com",
  "password": "securepassword"
}
```
Якщо все правильно, повернеться:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Вхід успішний"
}
```

---

### **🚨 Причина помилки**
Помилка:  
```
Error: secretOrPrivateKey must have a value
```
Це означає, що `process.env.JWT_SECRET` **не передано або воно порожнє**.

---

### **🛠 Як виправити?**

**Генерація випадкового 32-байтового ключа у Base64**

Це **команда для терміналу**, яка **генерує випадковий ключ**. Потрібно:  

1. **Відкрити термінал** та виконати команду:
   ```powerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

   ```
2. Вона виведе випадковий рядок, наприклад:
   ```
   fT2mF7X5pO7wLhV9N4G1h3AqY6TzUq5wM2X9J8L6h2E=
   ```
3. **Скопіюйте цей рядок** та вставте у `.env.local` ось так:
   ```
   JWT_SECRET=fT2mF7X5pO7wLhV9N4G1h3AqY6TzUq5wM2X9J8L6h2E=
   ```
4. **Збережіть `.env.local` та перезапустіть сервер:**
   ```sh
   pnpm dev
   ```

Тепер `process.env.JWT_SECRET` буде містити ваш згенерований ключ, і JWT працюватиме коректно. 🚀

5. **Перезапустіть сервер**  
   Щоб Next.js завантажив нові змінні середовища, запустіть:
   ```sh
   pnpm dev
   ```

6. **Переконайтеся, що `JWT_SECRET` передається в коді**  
   Додайте тимчасовий `console.log` у `login/route.js` перед `jwt.sign`:
   ```javascript
   console.log("JWT_SECRET:", process.env.JWT_SECRET);
   ```
   Якщо він повертає `undefined`, значить `.env.local` не підвантажується.

---

### **🚀 Після виправлення**
Після перезапуску повторіть **POST-запит на `http://localhost:3000/api/auth/login`**.  
✅ Якщо все добре, отримаєте `token`.

---

### **Що робити далі: `authMiddleware` чи API `/api/auth/me`?**  

Обидва ці кроки важливі, але виконують різні функції:


### **1️⃣ `authMiddleware` (Middleware для перевірки токена)**
📌 **Що це таке?**  
- Це функція, яка буде **перевіряти JWT-токен у кожному запиті**, де потрібна авторизація.  
- Якщо токен валідний → користувач отримує доступ.  
- Якщо токен невалідний або відсутній → повертається помилка `401 Unauthorized`.  

📌 **Для чого потрібно?**  
- Захист API-роутів (наприклад, `/api/documents`, `/api/users`).  
- Переконатися, що модератори можуть змінювати документи, а звичайні користувачі – ні.  

📌 **Що буде робити `authMiddleware`?**  
1. **Отримує токен з заголовків `Authorization` (`Bearer TOKEN`)**  
2. **Перевіряє, чи токен валідний**  
3. **Якщо так – передає дані користувача (`id`, `role`) в `req.user`**  
4. **Якщо ні – повертає `401 Unauthorized`**  

📌 **Приклад використання:**  
- `/api/documents` → тільки авторизовані можуть бачити документи.  
- `/api/documents/delete` → тільки **модератори** можуть видаляти.  
- `/api/users` → тільки **адміни** мають доступ.  

---

### **2️⃣ API `/api/auth/me` (Отримання даних поточного користувача)**
📌 **Що це таке?**  
- Це окремий API-роут, який повертає **інформацію про авторизованого користувача**.  
- Використовується для **фронтенду**, щоб дізнатися, хто зараз залогінений.  

📌 **Для чого потрібно?**  
- **Фронтенд** може запитати `/api/auth/me`, щоб отримати ім'я, email, роль.  
- Корисно для **відображення профілю** або перевірки, чи користувач адмін.  

📌 **Що буде робити API `/api/auth/me`?**  
1. **Отримує токен з запиту**  
2. **Перевіряє його**  
3. **Якщо токен валідний – повертає дані користувача (id, email, роль, ім’я тощо)**  
4. **Якщо ні – повертає `401 Unauthorized`**  

📌 **Приклад використання:**  
- **Фронтенд робить запит:**  
  ```sh
  GET /api/auth/me
  Headers: Authorization: Bearer YOUR_TOKEN
  ```
- **Сервер відповідає:**  
  ```json
  {
    "id": "12345",
    "email": "user@example.com",
    "role": "moderator",
    "firstName": "Іван",
    "lastName": "Петров"
  }
  ```

---

### **Далі робимо `authMiddleware`**, тому що він дозволить:  
- **Захистити API `/api/auth/me`**  
- **Перевіряти токен у будь-яких запитах**  
- **Розрізняти користувачів за ролями**  
  
---

### **🚀 Реалізація `authMiddleware` (Middleware для перевірки токена)**  

📌 **Що ми зробимо?**  
1. Створимо middleware `authMiddleware.js` для перевірки JWT.  
2. Додамо його до API, які потребують авторизації.  

---

### **1️⃣ Створюємо файл `src/middleware/authMiddleware.js`**
```javascript
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function authMiddleware(handler, requiredRole = null) {
  return async (req) => {
    try {
      // Отримуємо заголовок Authorization
      const authHeader = req.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Неавторизований доступ" }, { status: 401 });
      }

      // Отримуємо токен
      const token = authHeader.split(" ")[1];

      // Декодуємо токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Перевіряємо роль, якщо передано `requiredRole`
      if (requiredRole && decoded.role !== requiredRole) {
        return NextResponse.json({ error: "Недостатньо прав" }, { status: 403 });
      }

      return handler(req);
    } catch (error) {
      return NextResponse.json({ error: "Невірний або прострочений токен" }, { status: 401 });
    }
  };
}
```

---

### **2️⃣ Як це працює?**
- **Перевіряє заголовок `Authorization`** (`Bearer TOKEN`).
- **Розшифровує токен** за допомогою `jwt.verify()`.
- **Якщо `requiredRole` передано**, перевіряє, чи користувач має відповідну роль.
- **Якщо все ОК**, додає `req.user` і передає запит далі.
- **Якщо токен некоректний або немає прав**, повертає `401 Unauthorized` або `403 Forbidden`.

---

### **3️⃣ Як використовувати middleware у захищених API?**
#### **🔹 Захистимо API `/api/auth/me`**
📌 **Створіть `src/app/api/auth/me/route.js`**
```javascript
import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import User from "@/models/User";
import connectToDatabase from "@/utils/db";

async function handler(req) {
  await connectToDatabase();
  const user = await User.findById(req.user.id).select("-password"); // Вилучаємо пароль

  if (!user) {
    return NextResponse.json({ error: "Користувач не знайдений" }, { status: 404 });
  }

  return NextResponse.json(user);
}

// Обгортка middleware
export const GET = authMiddleware(handler);
```

---

### **4️⃣ Тестуємо захищений API**
📌 **Відправте GET-запит на `http://localhost:3000/api/auth/me` з токеном:**
```json
Headers: Authorization: Bearer YOUR_TOKEN
```
де `YOUR_TOKEN` — це JWT-токен**, який ми отримали при успішному вході.
**Можливі відповіді:**
✅ `200 OK` – якщо токен валідний, поверне дані користувача.  
❌ `401 Unauthorized` – якщо немає токена або він неправильний.  
❌ `403 Forbidden` – якщо користувач не має потрібної ролі (якщо ми це додамо).  

---

### **🚀 Далі можна додати перевірку ролей для модераторів та адмінів**
Наприклад, щоб **захистити API `/api/users`**, тільки для адмінів:
```javascript
export const GET = authMiddleware(handler, "admin");
```

---

#### ***📌 Де взяти `YOUR_TOKEN`?***
Коли ви робили **POST-запит на `http://localhost:3000/api/auth/login`**, у відповіді був:  
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzAzZmQ0MWU2ZGIxNGZhOGU1MjllNyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQwNjUzNzkyLCJleHAiOjE3NDEyNTg1OTJ9.LmqLmGm6XDmOhJJ_AIKw8n3ILYcRaxpYaZNVRoYp13w",
  "message": "Вхід успішний"
}
```
🔥 **Скопіюйте `token` та використовуйте його для запитів.**

---

### **📌 Як використовувати токен для перевірки API `/api/auth/me`?**
1. Відкрийте **Postman / Thunder Client / cURL / Insomnia** або просто браузер.  
2. Відправте **GET-запит** на `http://localhost:3000/api/auth/me`.  
3. У заголовку `Authorization` передайте **Bearer TOKEN**.  
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Очікуваний результат (якщо токен правильний):**
   ```json
   {
     "id": "12345",
     "email": "user@example.com",
     "role": "user",
     "firstName": "Іван",
     "lastName": "Петров"
   }
   ```

---

### **🔐 Процедура відновлення пароля (Password Reset Flow)**  

📌 **Що потрібно реалізувати?**  
1️⃣ Користувач надсилає email → `/api/auth/reset-password/request`  
2️⃣ Сервер генерує унікальний `resetToken` (JWT)  
3️⃣ Відправляє email з посиланням (`http://localhost:3000/reset-password?token=XYZ`)  
4️⃣ Користувач вводить новий пароль → `/api/auth/reset-password/confirm`  
5️⃣ Сервер перевіряє `resetToken`, зберігає новий пароль у базі  

---

### **1️⃣ Додайте поле `resetPasswordToken` у `User.js`**
📌 **В `src/models/User.js` додайте:**
```javascript
resetPasswordToken: { type: String, default: null },
resetPasswordExpires: { type: Date, default: null },
```
✅ **Це дозволить зберігати токен та його термін дії.**  

---

### **2️⃣ API для запиту відновлення пароля (`/api/auth/reset-password/request`)**
📌 **Створіть `src/app/api/auth/reset-password/request/route.js`**
```javascript
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export async function POST(req) {
  await connectToDatabase();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Користувач не знайдений" }, { status: 404 });
  }

  // Генеруємо токен для відновлення пароля (дійсний 1 годину)
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Зберігаємо токен у базі
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 година
  await user.save();

  // Симуляція відправки email (в реальному додатку треба підключити email-сервіс)
  console.log(`🔗 Посилання для відновлення пароля: http://localhost:3000/reset-password?token=${resetToken}`);

  return NextResponse.json({ message: "Перевірте email для відновлення пароля" });
}
```
✅ **Тепер користувач отримає посилання з токеном** (поки що просто в `console.log()`).

---

### **3️⃣ API для підтвердження нового пароля (`/api/auth/reset-password/confirm`)**
📌 **Створіть `src/app/api/auth/reset-password/confirm/route.js`**
```javascript
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export async function POST(req) {
  await connectToDatabase();
  const { token, newPassword } = await req.json();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
      return NextResponse.json({ error: "Недійсний або прострочений токен" }, { status: 400 });
    }

    // Хешуємо новий пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Видаляємо токен після зміни пароля
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json({ message: "Пароль успішно змінено" });
  } catch (error) {
    return NextResponse.json({ error: "Недійсний токен" }, { status: 400 });
  }
}
```
✅ **Тепер користувач вводить новий пароль, і він зберігається в базі.**  

---

### **4️⃣ Як це працює?**
1️⃣ **Запит на відновлення пароля**  
   ```http
   POST http://localhost:3000/api/auth/reset-password/request
   Body:
   {
     "email": "test@example.com"
   }
   ```
   🔗 У консолі з’явиться посилання на відновлення.

2️⃣ **Користувач відкриває сторінку відновлення**  
   - Фронтенд отримує `token` з `?token=XYZ`  
   - Вводить новий пароль  

3️⃣ **Запит на встановлення нового пароля**  
   ```http
   POST http://localhost:3000/api/auth/reset-password/confirm
   Body:
   {
     "token": "XYZ",
     "newPassword": "newSecurePassword"
   }
   ```
   ✅ Отримує `Пароль успішно змінено` 🎉  

Але для зміни паролю потрібно створили сторінку для введення нового пароля.  

---

📌 **Створимо сторінку `/reset-password` у Next.js.**  
Ця сторінка дозволить користувачам **ввести новий пароль** після натискання на посилання.

---

### **1️⃣ Створюємо файл `src/app/reset-password/page.jsx`**
```javascript
"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div>
      <h1>Відновлення пароля</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Новий пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Змінити пароль</button>
      </form>
    </div>
  );
}
```

---

### **2️⃣ Що цей код робить?**
✅ **Зчитує `token` з URL (`useSearchParams()`).**  
✅ **Дозволяє користувачеві ввести новий пароль.**  
✅ **Відправляє `POST`-запит на `/api/auth/reset-password/confirm`.**  
✅ **Відображає повідомлення про успішну зміну пароля або помилку.**  

---

### **3️⃣ Перевіряємо, чи працює**
1️⃣ **Перейдіть за посиланням, яке згенерував сервер**, наприклад:  
   ```
   http://localhost:3000/reset-password?token=XYZ
   ```
2️⃣ **Введіть новий пароль і натисніть "Змінити пароль".**  
3️⃣ **Переконайтесь, що у Postman можна увійти з новим паролем (`/api/auth/login`).**  

✅ **Тепер відновлення пароля повністю працює!** 🚀

