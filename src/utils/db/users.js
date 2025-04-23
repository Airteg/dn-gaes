import { connectToDatabase } from "../db";
import User from "@/models/User";

export const getUsers = async ({
  filter = {},
  sort = { createdAt: -1 },
  skip = 0,
  limit = 10,
  showDeleted = false,
} = {}) => {
  await connectToDatabase();

  const query = {
    ...filter,
    ...(showDeleted
      ? {} // Якщо showDeleted = true, показуємо всіх (і видалених, і невидалених)
      : { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }),
  };
  console.log("🔍 Запит до БД:", query);
  const users = await User.find(query).sort(sort).skip(skip).limit(limit);
  const total = await User.countDocuments(query);
  // console.log("📊 Знайдені користувачі:", users);
  console.log("📊 Загальна кількість:", total);

  return { users, total };
};

export const updateUser = async (id, updates) => {
  await connectToDatabase();
  const result = await User.findByIdAndUpdate(id, updates, { new: true });
  return result;
};

export const markUserAsDeleted = async (id) => {
  await connectToDatabase();
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};
