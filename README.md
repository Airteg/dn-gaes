✅ **Як відстежити процес авторизації `signIn("google")` у NextAuth.js?**  

📌 **Ми крок за кроком перевіримо, що відбувається під час входу**:  
1️⃣ Виклик `signIn("google")` на клієнті.  
2️⃣ Перенаправлення на OAuth.  
3️⃣ Отримання профілю Google.  
4️⃣ Створення/оновлення користувача в MongoDB.  
5️⃣ Збереження токена сесії.  
6️⃣ Виконання `callbacks.jwt` та `callbacks.session`.  

---

## **1️⃣ Логування клієнтського `signIn`**  

📂 **Файл: `src/app/login/page.jsx`** (або де викликається `signIn`)  
```javascript
import { signIn } from "next-auth/react";

const handleGoogleLogin = async () => {
  console.log("📌 Вхід через Google ініційовано...");
  const result = await signIn("google", { callbackUrl: "/dashboard" });

  if (result?.error) {
    console.error("❌ Помилка входу:", result.error);
  } else {
    console.log("✅ Вхід через Google успішний!");
  }
};
```
🔹 **Що ми бачимо в консолі?**  
- `"📌 Вхід через Google ініційовано..."` перед тим, як відбудеться редирект.  
- Якщо є помилка → `"❌ Помилка входу:"`.  
- Якщо вхід успішний → `"✅ Вхід через Google успішний!"`.  

---

## **2️⃣ Логування запиту до `/api/auth/callback/google`**  
📂 **Файл `src/app/api/auth/[...nextauth]/route.js`**  
```javascript
callbacks: {
  async signIn({ user, account, profile }) {
    console.log("📌 Користувач авторизується через Google:", profile);
    return true; // Дозволяємо вхід
  },

  async jwt({ token, user, account, profile }) {
    console.log("📌 Генерація JWT:", { token, user, account, profile });

    if (user) {
      token.id = user.id;
      token.role = user.role || "user";
      token.status = user.status || "pending";
    }
    return token;
  },

  async session({ session, token }) {
    console.log("📌 Формування сесії:", { session, token });

    session.user.id = token.id;
    session.user.role = token.role;
    session.user.status = token.status;

    return session;
  },
}
```
🔹 **Що ми бачимо в серверній консолі?**  
1️⃣ `"📌 Користувач авторизується через Google:"` – отримаємо весь профіль з Google.  
2️⃣ `"📌 Генерація JWT:"` – перевіримо, як NextAuth зберігає токен.  
3️⃣ `"📌 Формування сесії:"` – чи правильно зберігається `session.user.role` і `session.user.status`.  

---

## **3️⃣ Перевірка MongoDB після входу**  
📌 Виконай команду у терміналі (MongoDB shell або GUI, як MongoDB Compass):  
```sh
db.users.find().pretty()
```
🔹 **Переконаємося, що користувачі створюються правильно, і що у них є `role` та `status`.**  

---

## **✅ Далі: Тестуємо!**
1️⃣ **Додаємо `console.log` у `signIn()`, `signIn` callback, `jwt` та `session`.**  
2️⃣ **Перезапускаємо сервер:**  
   ```sh
   pnpm run dev
   ```
3️⃣ **Входимо через Google.**  
4️⃣ **Перевіряємо консоль браузера та серверні логи.**  

🔥 Домовились! Тримаєш — **Практичний список правил для стабільної роботи з Next.js 13–15 (App Router)**. Це не з документації — це з реальних боїв:

---

## ✅ 1. `"use server"` — **тільки для server actions**
- Не пиши в компонентах, які повертають JSX
- Має бути **в окремій функції**, що викликається через `action`, `form action`, `startTransition`, тощо
```ts
// OK — server action
"use server";
export async function updateUser(data) { ... }

// ❌ Не роби так:
"use server";
export default function Page() { return <div />; }
```

---

## ✅ 2. Серверні компоненти не потребують `"use server"`
- Усі `page.tsx`, `layout.tsx`, серверні `component.tsx` — автоматично виконуються на сервері

---

## ✅ 3. `auth()` (next-auth) викликаємо **тільки**:
- у серверних компонентах
- у server actions (`"use server"`)
- ❌ **Не в клієнтських компонентах!**

---

## ✅ 4. Не імпортуй `db` у `middleware.js`
- `middleware` працює в **Edge Runtime**
- Імпортуй тільки `auth`, `cookies`, `NextResponse`
- 🔥 Якщо треба ролі — використовуй `token` з `auth().token.role`

---

## ✅ 5. В `env`-змінних — пиши **повну назву змінної**
- `GOOGLE_CLIENT_ID`, а не `GOOGLE_ID`
- `GOOGLE_CLIENT_SECRET`, а не `GOOGLE_SECRET`
- Інакше next-auth не бачить її або не передає далі

---

## ✅ 6. Уникай `useEffect` для сесій/ролей
- На сервері є `auth()` — використовуй його
- Не "довантажуй" сесію через клієнтські хакі

---

## ✅ 7. Кожна логіка має бути **в окремому місці**:
| Що?                        | Де?                                |
|---------------------------|-------------------------------------|
| Аутентифікація             | `authConfig.js` або `auth.js`      |
| Server Action              | окремий `actions/xyz.js`           |
| API-обробка                | у `route.js` (в API)               |
| Валідація (yup/zod)        | окремо в `lib/validators`          |
| Mongo DB підключення       | `utils/db.js`                      |

---

## ✅ 8. Після зміни `.env.local` — завжди:
- збережи файл
- перезапусти dev-сервер
```bash
pnpm dev
```

---

## ✅ 9. `next-auth` не зберігає `role` автоматично
- Зберігай через `callbacks.jwt()` і `callbacks.session()`

---

## ✅ 10. Сесія з `auth()` ≠ сесія з `useSession()`
| Метод        | Де працює        | Призначення             |
|--------------|------------------|--------------------------|
| `auth()`     | сервер            | захист сторінок, role    |
| `useSession()` | клієнт           | показ кнопок UI, меню    |

---

## 🟡 Авторизація через Google + Додавання користувача в базу

### ✅ Досягнуто:
- Успішна авторизація через Google (NextAuth v5).
- Після входу користувача зберігаємо в базу MongoDB (через `MongoDBAdapter`).

### ❌ Проблема:
- Після додавання `MongoDBAdapter` виникла помилка `The edge runtime does not support Node.js 'crypto' module`.
- Це сталося, тому що `auth()` з `@/auth` використовувався в **middleware**, який працює в **Edge Runtime**. Адаптер `MongoDBAdapter` тягне `mongodb`, який використовує `crypto`, несумісний з Edge.

### ✅ Рішення:
- У **middleware** замінено `auth()` на `getToken()` з `next-auth/jwt` — він сумісний з Edge і дозволяє витягти JWT без ініціалізації адаптера.
- `auth()` залишено тільки в API Routes і серверному коді (Node.js).

---

> Цей підхід дозволив зберегти гнучкість: ми використовуємо MongoDBAdapter і при цьому уникаємо конфліктів з Edge Runtime.