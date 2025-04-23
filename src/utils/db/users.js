import { connectToDatabase } from "../db";
import User from "@/models/User";

// Функція для отримання користувачів з БД
// !🔹 Параметри:
// filter — MongoDB-фільтр (пошук за іменем, email тощо)
// sort — сортування (за замовчуванням: найновіші)
// skip — скільки пропустити (пагінація)
// limit — скільки повернути (пагінація)
// showDeleted — якщо false, приховуємо видалених (isDeleted: true)
export const getUsers = async ({
  filter = {},
  sort = { createdAt: -1 },
  skip = 0,
  limit = 10,
  showDeleted = false,
} = {}) => {
  await connectToDatabase();

  // 🔧 Запит у базу:
  const query = {
    ...filter,
    ...(showDeleted
      ? {} // Якщо showDeleted = true, показуємо всіх (і видалених, і невидалених)
      : { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }),
  };
  console.log("🔍 Запит до БД:", query);

  // 🛠 Виконуємо запит до бази даних
  //   User.find() — повертає масив користувачів
  //   User.countDocuments() — підраховує загальну кількість по тому ж запиту
  const users = await User.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await User.countDocuments(query);
  // console.log("📊 Знайдені користувачі:", users);
  console.log("📊 Загальна кількість користувачів:", total);

  return { users, total };
};

// шукає користувача за _id
// оновлює поля з updates
// повертає оновлений документ
export const updateUser = async (id, updates) => {
  await connectToDatabase();
  const result = await User.findByIdAndUpdate(id, updates, { new: true });
  return result;
};

// позначає користувача як видаленого (мʼяке видалення)
// не видаляє фізично з бази
export const markUserAsDeleted = async (id) => {
  await connectToDatabase();
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};
