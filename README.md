Ваш підхід до автентифікації з Google і email/password виглядає логічним і практичним із точки зору користувацького досвіду, але є кілька моментів, які варто обговорити й покритикувати, щоб зробити його більш надійним і гнучким, особливо з урахуванням майбутнього додавання інших провайдерів. Я проаналізую вашу пропозицію, вкажу на потенційні слабкі місця та запропоную вдосконалення. Потім ми перейдемо до ситуації з email/password.

---

### Ваш підхід для Google OAuth
#### Опис
1. **Провайдери**: Google + email/password зараз, із можливістю додавання інших провайдерів у майбутньому.
2. **Ситуація: Вхід через Google**:
   - Перевіряємо, чи є `email` у базі (`users`).
     - **Якщо email не існує**: Перенаправляємо на `/register`.
     - **Якщо email існує**:
       - Перевіряємо, чи прив’язаний email до Google (або іншого провайдера).
       - Якщо прив’язки немає (наприклад, `method: "credentials"`), перенаправляємо на `/register` із повідомленням: *"Цей email існує в базі даних. Оберіть інший акаунт"*.
     - **Якщо email прив’язаний до Google**: Дозволяємо вхід, оновлюємо `lastLogin`.
   - **Опція для користувача**:
     - Якщо іншого акаунта немає, користувач використовує "Забув пароль" для email/password.
     - У кабінеті може видалити прив’язку до email/password і залишити тільки Google.

#### Алгоритм (спрощений)
1. Користувач натискає "Увійти через Google".
2. Отримуємо `user.email` від Google.
3. Перевіряємо `users`:
   - Немає → `/register`.
   - Є:
     - `method: "google"` → Оновлюємо `lastLogin`, дозволяємо вхід.
     - `method: "credentials"` → `/register?error=EmailExists`.

---

### Критика підходу
#### 1. Переваги
- **Простота для нових користувачів**: Якщо email не зайнятий, вони йдуть на реєстрацію, що зрозуміло.
- **Запобігання конфліктам**: Ви явно розділяєте методи автентифікації (`google` vs `credentials`), уникаючи автоматичного перезапису.
- **Гнучкість для користувача**: Можливість видалити один метод у кабінеті — зручна опція.
- **Майбутнє розширення**: Логіка з перевіркою `method` легко масштабується для інших провайдерів (наприклад, `facebook`, `github`).

#### 2. Слабкі місця та проблеми
1. **Перенаправлення на `/register` при конфлікті**:
   - **Проблема**: Якщо email уже зайнятий із `method: "credentials"`, перенаправлення на `/register` із повідомленням "Оберіть інший акаунт" може заплутати користувача. Чому на реєстрацію, якщо email уже є? Логічніше перенаправити на `/login` із повідомленням: *"Цей email зареєстрований через email/password. Увійдіть так або скиньте пароль"*.
   - **Чому це важливо**: Користувач може не зрозуміти, що йому не треба реєструватися, а лише змінити метод входу чи акаунт.

2. **Відсутність автоматичного зв’язування**:
   - **Проблема**: Якщо користувач із `method: "credentials"` хоче додати Google як альтернативний спосіб входу (а не видаляти email/password), ваш підхід цього не дозволяє. Він змушений видалити старий акаунт і зареєструватися заново через Google.
   - **Чому це незручно**: У реальних системах (наприклад, Gmail, GitHub) користувач може прив’язати кілька методів до одного акаунта (email + Google + GitHub).

3. **"Забув пароль" як єдиний вихід**:
   - **Проблема**: Якщо в користувача немає іншого Google-акаунта, він змушений скидати пароль для email/password, а потім видаляти цей метод. Це додаткові кроки, які можна спростити.
   - **Чому це не оптимально**: Користувач може просто хотіти прив’язати Google до існуючого акаунта без скидання пароля.

4. **Майбутні провайдери**:
   - **Проблема**: Перевірка тільки на `method: "google"` чи `method: "credentials"` не враховує, що в майбутньому можуть бути `facebook`, `github` тощо. Якщо email зайнятий через `github`, а користувач заходить через Google, що тоді?
   - **Чому це важливо**: Потрібна більш загальна логіка для обробки всіх OAuth-провайдерів.

5. **Відсутність статусу "зареєстрований"**:
   - **Проблема**: У вашій моделі немає явного статусу, який би вказував, чи користувач завершив реєстрацію. Наприклад, якщо він зареєструвався через `/register`, але ще не прив’язав Google, це може викликати плутанину.
   - **Чому це корисно**: Додавання поля `status: "pending"` чи `status: "active"` може спростити логіку.

#### 3. Пропозиції вдосконалення
1. **Перенаправлення на `/login` замість `/register`**:
   - Якщо email зайнятий із `method: "credentials"`, перенаправляйте на `/login?error=UseCredentials` із повідомленням: *"Цей email зареєстрований через email/password. Увійдіть так або скиньте пароль"*.
   - Для нового користувача залиште `/register`.

2. **Дозволити прив’язку кількох методів**:
   - Додайте в `users` масив `methods: ["google", "credentials"]` замість одного `method`.
   - Якщо email існує, але Google не прив’язаний, запропонуйте прив’язати його в кабінеті замість блокування.

3. **Статус користувача**:
   - Додайте поле `status`:
     - `"pending"`: Зареєстрований, але не прив’язав провайдер.
     - `"active"`: Повноцінний акаунт.
   - Блокуйте вхід через Google, якщо `status: "pending"`, доки не завершиться реєстрація.

4. **Універсальна логіка для провайдерів**:
   - Замість перевірки `method: "google"`, перевіряйте, чи є `providerAccountId` у `accounts` для будь-якого OAuth-провайдера (`google`, `facebook` тощо).

---

### Оновлений алгоритм (з урахуванням критики)
#### Ситуація: Вхід через Google
1. Користувач натискає "Увійти через Google".
2. Отримуємо `user.email` і `account.providerAccountId` від Google.
3. Перевіряємо `users` за `email`:
   - **Немає**:
     - Перенаправляємо на `/register`.
   - **Є**:
     - Перевіряємо `accounts` за `provider: "google"` і `providerAccountId`:
       - Якщо є → Оновлюємо `lastLogin` у `users`, дозволяємо вхід.
       - Якщо немає → Перевіряємо `methods` (або `method`, якщо залишаємо один):
         - Якщо `methods` не включає `"google"` (наприклад, тільки `"credentials"`) → Перенаправляємо на `/login?error=UseDifferentMethod` із повідомленням: *"Цей email зареєстрований іншим способом. Увійдіть так або прив’яжіть Google у кабінеті"*.
4. Логування: `email`, `provider`, `providerAccountId`, результат перевірки.

#### Опція для користувача
- У кабінеті:
  - Додати/видалити методи (`google`, `credentials` тощо).
  - Скинути пароль для `credentials`, якщо потрібно.

#### Майбутнє розширення
- Додаємо нові провайдери (`facebook`, `github`) до `methods` і `accounts`.

---

### Перехід до email/password
Тепер, коли ми обговорили Google, давайте визначимо алгоритм для входу через email/password. Ось мої припущення, але уточніть ваші вимоги:
1. **Реєстрація**: Тільки через `/register` (email, password).
2. **Вхід**:
   - Перевіряємо email і пароль.
   - Якщо email зайнятий Google, блокуємо чи дозволяємо?
3. **Конфлікти**: Як поводитися, якщо email уже прив’язаний до Google?

**Питання до вас**:
- Чи хочете ви, щоб email/password був основним методом, а Google — додатковим?
- Чи дозволяти одному email мати обидва методи (`google` + `credentials`)?

Дайте відповіді, і я розпишу алгоритм для email/password із критикою, як ми зробили для Google. Потім об’єднаємо це в єдиний план. Що скажете?

---
**"Чи хочете ви, щоб email/password був основним методом, а Google — додатковим?"**
Я не розумію переваг, тому чекаю на рекомендацію.
**"Чи дозволяти одному email мати обидва методи (google + credentials)?"**
Так... Дозволяти одному email мати всі методи (google + credentials + ...) Я тільки лякаюсь, як все тестувати...

---

Дякую за ваші уточнення! Ваші відповіді дають мені чітке розуміння того, що ви хочете дозволити одному email мати кілька методів автентифікації (Google, email/password тощо), але ви не впевнені, чи варто робити email/password основним методом, і переживаєте за тестування. Я поясню переваги й недоліки обох підходів, дам рекомендацію, а потім розпишу алгоритм для email/password із критикою. Після цього ми об’єднаємо все в план і розберемося з тестуванням.

---

### Чи робити email/password основним методом, а Google — додатковим?
#### Що це означає?
- **Email/password як основний**: Реєстрація відбувається через email/password, а Google (та інші провайдери) додаються як опціональні методи входу до існуючого акаунта.
- **Google як основний**: Реєстрація через Google автоматична, а email/password — додаткова опція.

#### Переваги та недоліки
##### Варіант 1: Email/password основний, Google додатковий
- **Переваги**:
  1. **Контроль**: Користувач спочатку створює акаунт із паролем, що дає йому повний контроль над учеткою (може скинути пароль, видалити провайдери).
  2. **Безпека**: Пароль — це "рідний" метод, який не залежить від зовнішніх сервісів (Google може заблокувати акаунт).
  3. **Гнучкість**: Легко додавати/видаляти OAuth-провайдери (Google, Facebook) у кабінеті.
  4. **Традиційність**: Більшість систем (наприклад, банки, магазини) використовують email/password як базовий метод.
- **Недоліки**:
  1. **Складність для користувача**: Потрібно спочатку зареєструватися через форму, а потім прив’язувати Google.
  2. **Додатковий крок**: Не підходить, якщо ви хочете швидкий вхід через Google без пароля.

##### Варіант 2: Google основний, email/password додатковий
- **Переваги**:
  1. **Швидкість**: Користувач входить через Google одним кліком, без пароля.
  2. **Простота**: Не потрібна форма реєстрації для нових користувачів — Google все робить автоматично.
  3. **Популярність**: Соцмережі (наприклад, Twitter, Discord) часто дозволяють вхід через Google без пароля.
- **Недоліки**:
  1. **Залежність**: Якщо Google-акаунт заблоковано, користувач втрачає доступ, якщо email/password не прив’язаний.
  2. **Менше контролю**: Користувач не може скинути пароль, якщо його немає.
  3. **Складність із видаленням**: Якщо Google — основний, видалення прив’язки може вимагати складної логіки.

##### Варіант 3: Обидва методи рівноправні
- **Переваги**:
  1. **Гнучкість**: Користувач сам обирає, як реєструватися і входити (Google чи email/password).
  2. **Майбутнє розширення**: Легко додати інші провайдери (Facebook, GitHub) на тому ж рівні.
  3. **Зручність**: Один email може мати кілька методів без "головного".
- **Недоліки**:
  1. **Складність логіки**: Потрібно обробляти конфлікти між методами.
  2. **Тестування**: Більше сценаріїв для перевірки.

#### Моя рекомендація
- **Варіант 3: Обидва методи рівноправні**.
- **Чому**:
  - Ви хочете дозволяти кілька методів для одного email (`google`, `credentials`, і в майбутньому інші), що ідеально вписується в цю модель.
  - Це дає максимальну гнучкість користувачам: хтось може почати з Google, хтось із email/password.
  - З урахуванням майбутніх провайдерів (Facebook, GitHub), рівноправність спрощує масштабування.
  - Ваш страх щодо тестування виправданий, але я допоможу розписати сценарії, щоб усе було під контролем.

#### Як це реалізувати?
- У `users` додамо масив `methods: ["google", "credentials"]` замість одного `method`.
- Користувач може додавати/видаляти методи в кабінеті.

---

### Алгоритм для email/password
#### Опис
- Користувач хоче увійти через email/password.
- Дозволяємо одному email мати кілька методів (`google`, `credentials` тощо).

#### Алгоритм
1. Користувач вводить email і пароль у формі входу.
2. Перевіряємо `users` за `email`:
   - **Немає**:
     - Перенаправляємо на `/register?error=UserNotFound` із повідомленням: *"Цей email не зареєстрований. Зареєструйтесь"*.
   - **Є**:
     - Перевіряємо `methods`:
       - Якщо `methods` включає `"credentials"`:
         - Порівнюємо введений пароль із захешованим у базі.
         - Якщо збігається → Оновлюємо `lastLogin`, дозволяємо вхід.
         - Якщо ні → Помилка: *"Невірний пароль"*.
       - Якщо `methods` не включає `"credentials"` (наприклад, тільки `"google"`) → Перенаправляємо на `/login?error=UseDifferentMethod` із повідомленням: *"Цей email прив’язаний до Google. Увійдіть через Google або додайте пароль у кабінеті"*.
3. Логування: `email`, `methods`, результат перевірки.

#### Реєстрація
- Користувач іде на `/register`, вводить email і пароль:
  - Перевіряємо `users`:
    - Якщо email не зайнятий → Додаємо до `users` із `methods: ["credentials"]`.
    - Якщо email зайнятий → Пропонуємо прив’язати `credentials` до існуючого акаунта (у кабінеті).

---

### Критика підходу
#### Переваги
1. **Гнучкість**: Один email може мати кілька методів, що зручно для користувачів.
2. **Майбутнє розширення**: Легко додати `facebook`, `github` до `methods`.
3. **Контроль**: Користувач може додавати/видаляти методи в кабінеті.

#### Слабкі місця
1. **Складність конфліктів**:
   - Якщо email має `"google"`, але користувач вводить неправильний пароль у формі, він отримує помилку, хоча міг би увійти через Google. Потрібно чітко повідомляти про доступні методи.
2. **Реєстрація при зайнятому email**:
   - Якщо email уже має `"google"`, а користувач хоче додати `"credentials"`, перенаправлення на `/register` може заплутати. Логічніше перенаправити в кабінет для прив’язки.
3. **Тестування**:
   - Багато комбінацій: Google є/немає, credentials є/немає, обидва є тощо.

#### Вдосконалення
1. **Повідомлення про методи**:
   - При помилці показувати: *"Цей email прив’язаний до Google. Увійдіть через Google або введіть правильний пароль"*.
2. **Прив’язка в кабінеті**:
   - Замість `/register` для зайнятого email перенаправляти в `/dashboard?addMethod=credentials`.
3. **Статус**:
   - Додати `status: "active"` після першої реєстрації, щоб відрізняти нові акаунти від існуючих.

---

### Об’єднаний план
#### Google OAuth
- Немає email → `/register`.
- Є email:
  - `methods` включає `"google"` → Вхід.
  - `methods` не включає `"google"` → `/login?error=UseDifferentMethod`.

#### Email/Password
- Немає email → `/register`.
- Є email:
  - `methods` включає `"credentials"` → Перевіряємо пароль, вхід або помилка.
  - `methods` не включає `"credentials"` → `/login?error=UseDifferentMethod`.

#### Реєстрація
- Новий email → Додаємо з обраним методом (`google` або `credentials`).
- Зайнятий email → Пропонуємо увійти та прив’язати новий метод у кабінеті.

#### Тестування
- Сценарії:
  1. Новий Google → Реєстрація.
  2. Новий email/password → Реєстрація.
  3. Google є, додаємо credentials.
  4. Credentials є, додаємо Google.
  5. Обидва методи, вхід через кожен.

---

### Відповідь на ваші страхи
- **Тестування**: Я розпишу всі сценарії з прикладами логів і станом бази в Compass, щоб ви могли перевірити кожен випадок.
- **Рекомендація**: Рівноправні методи — це ваш шлях, бо це гнучко й зручно для майбутнього.

---

# Пояснення коду 'authConfig'
**Докладно** та **по порядку**, як працює `authConfig`, коли ми використовуємо:

```js
export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
```

## 🔁 Загальна ідея

`authConfig` — це конфігурація, яка **налаштовує весь механізм авторизації** у `next-auth@v5`.

Функція `NextAuth(authConfig)` створює:
- `auth(req)` — перевірка сесії (на сервері, у middleware, тощо),
- `handlers` — обробники для API маршрутів (`GET/POST /api/auth/*`),
- `signIn()` та `signOut()` — серверні функції для входу/виходу.

---

## 🔧 Що всередині `authConfig` і коли воно викликається?

### 1. **`adapter`**
```js
adapter: MongoDBAdapter(clientPromise)
```

- Вказує, **як зберігати користувачів та сесії** (у базу MongoDB).
- Автоматично створює колекції `users`, `accounts`, `sessions`, `verificationTokens`.
- Використовується `signIn`, `session`, `auth()` і `handlers`.

> 🔥 Без адаптера користувачі не зберігаються в базі.

---

### 2. **`providers`**
```js
providers: [Google({...}), Credentials({...})]
```

- Надають способи входу: Google OAuth, або email/пароль.
- Кожен викликає **свою логіку авторизації**:
  - Google → йде на `signIn` + `adapter`
  - Credentials → викликає `authorize()` з твоєю логікою

---

### 3. **`callbacks.signIn({ user, account })`**
Викликається **після успішної авторизації**.

- Тут можна:
  - Відхилити вхід: `return false` або `return '/login?error=...'`
  - Додати/оновити юзера вручну
  - Зберегти, що юзер використав Google або credentials

> 🧠 Ми використовуємо тут ручне оновлення/додавання метаданих, бо `adapter` **не дає змоги оновити поле `methods` автоматично**.

---

### 4. **`callbacks.session({ session, token })`**
Викликається **на кожен запит**, коли потрібна сесія.

- Тут ми збагачуємо сесію:
  - додаємо `session.user.id`
  - додаємо `session.user.role`, `status`, `methods`
- Це потрапляє на фронтенд через `useSession()`.

---

### 5. **`session.strategy: "jwt"`**
Це означає:
- Ми не зберігаємо сесії в базі (`sessions` не потрібна)
- Вся сесія — в JWT токені (в cookie)

> 📌 Це зручно, але тоді **все треба додавати в `session` callback** вручну.

---

### 6. **`authorize(credentials)`**
Це тільки для Credentials Provider.

- Викликається при вході по email/пароль.
- Перевіряє існування юзера + пароль.
- Якщо ок — повертає `{ id, email }`.

> 🔐 Якщо не повернеш `id`, NextAuth впаде з помилкою.

---

### 7. **`auth()`**
Це зручний інструмент (з `src/auth.js`) — він:
- читає сесію через cookie
- перевіряє токен
- повертає об'єкт сесії `{ user }` або `null`

> ⚠️ Не можна викликати `auth()` у middleware, якщо всередині `authConfig` є Node.js-несумісний код (наприклад, MongoDB).

---

## 🧠 Як усе разом працює:

1. Користувач натискає "Увійти через Google" → `signIn("google")`
2. NextAuth обробляє OAuth → отримає email + profile → викликає `signIn` callback
3. У `signIn` ми:
   - Перевіряємо: чи існує юзер
   - Якщо ні → редіректимо на реєстрацію
   - Якщо є → оновлюємо `lastLogin`, додаємо метод
4. Сесія формується → викликається `session` callback
5. У сесії ми додаємо id, role, status → це летить на фронт
6. Фронт бачить `useSession()` і реагує

---

## 🔐 Аутентифікація

У проєкті використовується `next-auth@5` з такими провайдерами:

- Google OAuth
- Email/Password (через CredentialsProvider)

Для зберігання користувачів використовується `@auth/mongodb-adapter`, що працює з MongoDB Atlas через `clientPromise`.

---

### ⚙️ authConfig — логіка входу

- **adapter** — MongoDBAdapter зберігає `users`, `accounts`, `sessions` у базі
- **session.strategy = "jwt"** — дані сесії зберігаються в cookie, не в базі
- **callbacks.signIn** — перевірка методу (google/credentials), створення/оновлення юзера
- **callbacks.session** — додавання до сесії `user.id`, `user.role`, `user.status`, `user.methods`
- **authorize** — логіка входу по email/паролю, перевірка пароля через `bcrypt`

---

### 🧩 Додатково

- При вході Google-юзера, який уже існує, але з credentials — редірект на `/login?error=...`
- При вході нового Google-юзера — редірект на `/register` (поки не підтверджено)

---

### 📦 Колекції в базі

- `users` — користувачі з полями email, role, status, methods
- `accounts` — для OAuth-методів
- `sessions` — (не використовується з jwt-стратегією)

---

### 🛡 Middleware

Middleware для захисту сторінок більше не використовує `auth()`, бо це несумісно з Edge Runtime. Замість цього — `getToken()` з `next-auth/jwt`.

---

### Аналіз коду `MongoDBAdapter`
Код із `index.ts` показує, як адаптер реалізує методи `Adapter` із `@auth/core/adapters`. 
Нижче ключові моменти, які стосуються створення користувача й додавання кастомних даних.

#### Метод `createUser`
```typescript
async createUser(data) {
  const user = to<AdapterUser>(data);
  await using db = await getDb();
  await db.U.insertOne(user);
  return from<AdapterUser>(user);
}
```
- **Що робить**:
  - Бере об’єкт `data` (типу `AdapterUser`), який приходить від `Auth.js`.
  - Перетворює його в MongoDB-формат через `to` (додає `_id`).
  - Вставляє в колекцію `users`.
  - Повертає результат у форматі `AdapterUser`.
- **Що в `data`**:
  - Для Google: `email`, `name`, `image` (з профілю Google), але **не** кастомні поля типу `role` чи `comments`.
- **Проблема**: Ми не контролюємо `data`, яке передає `Auth.js` у `createUser`. Воно формується з OAuth-відповіді, і ми не можемо додати туди `role` напряму.

#### Метод `getUserByEmail`
```typescript
async getUserByEmail(email) {
  await using db = await getDb();
  const user = await db.U.findOne({ email });
  if (!user) return null;
  return from<AdapterUser>(user);
}
```
- **Що робить**: Шукає користувача за `email` і повертає його.
- **Можливість**: Ми можемо використати це в `signIn`, щоб оновити запис.

#### Коментарі в коді
Коментар про `client` і `onClose` натякає на гнучкість підключення, але не стосується кастомізації схеми. Адаптер явно розроблений як "універсальний", без вбудованої підтримки кастомних полів.

---

### Чому ми не можемо додати `role` напряму?
1. **Фіксована схема**:
   - `MongoDBAdapter` працює з типом `AdapterUser`:
     ```typescript
     interface AdapterUser {
       id: string;
       email: string;
       emailVerified: Date | null;
       name?: string | null;
       image?: string | null;
     }
     ```
   - Немає `role`, `comments` чи інших кастомних полів.
2. **OAuth-провайдер**:
   - Google передає тільки базові дані (`email`, `name`, `image`), і `Auth.js` викликає `createUser` із цими даними.
3. **Конфлікт при ручному `upsert`**:
   - Якщо ми додаємо користувача в `signIn` через `updateOne(..., { upsert: true })`, це дублює роботу адаптера й викликає `OAuthAccountNotLinked`.

---

### Документоване рішення
Про цю проблему в документації [Auth.js MongoDB Adapter](https://authjs.dev/reference/adapter/mongodb):
- Адаптер підтримує базові методи, але **не згадує** додавання кастомних полів у `users`.
- У [Customizing Models](https://authjs.dev/reference/core/adapters#customizing-the-adapter) є рекомендація:
  > "If you need to customize the schema, you can create a custom adapter by extending an existing one or writing your own."

Це означає, що:
- **Стандартний шлях**: Використовувати `signIn` чи `session` для оновлення даних після створення.
- **Гнучкий шлях**: Написати кастомний адаптер.

---

### Проблема
"Це ненормально, коли ми вводимо користувача і не можемо додати свої коментарі". І це правда — у типових системах ми хочемо:
- Створити користувача з кастомними полями (`role`, `comments`) одразу.
- Бути незалежними від адаптера чи бази (MongoDB, SQL, Excel).

Наш обхід у `middleware` (`role || "user"`) — це тимчасове рішення, яке не вирішує проблему в базі.

---

### Оптимальне рішення
#### 1. Оновлення в `signIn` (без конфліктів)
Ми вже пробували це, і воно працює, якщо не використовувати `upsert`. Робочий `authConfig.js` плюс виправлення:

```javascript
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/utils/db";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");
        const user = await users.findOne({ email: credentials.email });
        if (!user) throw new Error("UserNotRegistered");
        if (!user.methods?.includes("credentials")) throw new Error("UseDifferentMethod");
        const isValid = bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("InvalidPassword");
        console.log("Credentials: User authenticated:", { email: credentials.email });
        return { id: user._id.toString(), email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async signIn({ user, account }) {
      console.log("signIn called:", { email: user.email, provider: account?.provider });
      const client = await clientPromise;
      const db = client.db();
      const users = db.collection("users");

      if (account?.provider !== "credentials") {
        const existingUser = await users.findOne({ email: user.email });
        if (existingUser) {
          // Оновлюємо тільки якщо role чи comments відсутні
          const updates = {};
          if (!existingUser.role) updates.role = "user";
          if (!existingUser.comments) updates.comments = "Новий користувач через Google";
          if (Object.keys(updates).length > 0) {
            await users.updateOne(
              { email: user.email },
              { $set: { ...updates, lastLogin: new Date() } }
            );
            console.log("Updated user with defaults:", { email: user.email, updates });
          }
        }
        return true;
      }

      await users.updateOne(
        { email: user.email },
        { $set: { lastLogin: new Date() } }
      );
      return true;
    },
    async session({ session, token }) {
      const client = await clientPromise;
      const db = client.db();
      const user = await db.collection("users").findOne({ email: session.user.email });
      if (user) {
        session.user.id = user._id.toString();
        session.user.name = user.name;
        session.user.role = user.role;
        session.user.comments = user.comments;
        token.role = user.role;
      }
      return session;
    },
  },
};
```

- **Як працює**:
  - Адаптер створює користувача.
  - У `signIn` ми перевіряємо, чи є `role`/`comments`, і додаємо їх, якщо відсутні.
  - У `session` ми переносимо ці дані в токен і сесію.

#### 2. Кастомний адаптер (для повного контролю)
Якщо ти хочеш позбутися залежності від `MongoDBAdapter` і готуватися до SQL/Excel, ось приклад:

```javascript
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/utils/db";

export function CustomMongoDBAdapter(client) {
  const adapter = MongoDBAdapter(client);

  const originalCreateUser = adapter.createUser;
  adapter.createUser = async (data) => {
    const user = await originalCreateUser(data);
    const clientInstance = await client;
    const db = clientInstance.db();
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { role: "user", comments: "Створено через кастомний адаптер" } }
    );
    return { ...user, role: "user", comments: "Створено через кастомний адаптер" };
  };

  return adapter;
}

export const authConfig = {
  adapter: CustomMongoDBAdapter(clientPromise),
  // ... решта конфігурації
};
```

- **Перевага**: Ти контролюєш створення користувача й можеш додати будь-які поля.

---

### Тестування
1. Очисти базу.
2. Увійди через Google із `authConfig.js` (Варіант 1).
3. Перевір:
   - База: `{ email: "test@gmail.com", role: "user", comments: "Новий користувач через Google" }`.
   - Логи: `Updated user with defaults: { email: "test@gmail.com", updates: { role: "user", comments: "..." } }`.
   - `/admin`: Перенаправлення на `/`.

---

### Висновок
- **Варіант 1**: Просте рішення, яке працює з `MongoDBAdapter` і додає `role`/`comments` у базу.
- **Варіант 2**: Кастомний адаптер для повної гнучкості (рекомендую для SQL/Excel у майбутньому).

Я б почав із Варіанту 1, бо він швидший і відповідає твоїй поточній базі. Спробуй його, поділися логами, і якщо все ок — ми вирішимо проблему раз і назавжди! Що скажеш?