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

📌 **Якщо бачимо всі етапи логування, ми повністю контролюємо процес! 🚀**  
Ти хочеш змінювати логіку, наприклад, додавати додаткові поля у користувача?