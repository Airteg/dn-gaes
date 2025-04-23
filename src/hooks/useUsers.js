import { useQuery } from "@tanstack/react-query";
import fetchWithAuth from "@/utils/fetchWithAuth";
// 🔹 Імпорти:
// useQuery — основний хук з react-query, який відповідає за кеш, фетчинг, оновлення.
// fetchWithAuth — функція для безпечного HTTP-запиту з авторизацією (Bearer-token).

// 🔹 Експортуємо хук:
// Приймає об'єкт з параметрами:
// filter: пошук по імені/емейлу
// showDeleted: показувати видалених?
// page: номер сторінки
export const useUsers = ({ filter = "", showDeleted = false, page = 1 }) =>
  useQuery({
    // !🔹 queryKey:
    // Ключ, за яким react-query кешує дані.
    // Якщо filter, page, showDeleted зміняться — запит виконається заново.
    // ["users", {...}] — допомагає react-query автоматично кешувати і
    // пере викликати тільки тоді, коли є зміни.
    queryKey: ["users", { filter, showDeleted, page }],
    // !🔹 queryFn:
    // Функція, яка викликає fetchWithAuth.
    // Формує URL з параметрами.
    // encodeURIComponent(filter) — на випадок, якщо в filter є пробіли, символи тощо.
    queryFn: async () => {
      return await fetchWithAuth(
        `/api/admin/users?filter=${encodeURIComponent(filter)}&showDeleted=${showDeleted}&page=${page}`,
      );
    },
    // !🔹 staleTime:
    // Протягом цього часу react-query не буде фетчити заново, бо вважає дані "свіжими".
    // Якщо ти відкриєш сторінку знову до 60 сек — буде миттєвий показ з кешу.
    staleTime: 1000 * 60, // 1 хвилина кешу
    // !     retry:
    // Якщо false, react-query не повторює запит при помилці.
    // Корисно, якщо очікуєш, що 403/401 — це не тимчасова проблема (тобто, юзер не має доступу).
    retry: false, // не повторювати запити при 401/403
  });
// 📦 Результат:
// const { data, isLoading, error } = useUsers({ ... });
// data: { users: [...], total: N }
// isLoading: true/false (стан завантаження)
// error: якщо щось пішло не так
// 🔁 Все працює автоматично: кеш, повторне використання, рефетч.
