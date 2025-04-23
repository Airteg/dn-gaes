"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export default function UsersTable({
  users = [], // Дефолтне значення
  total = 0,
  page,
  filter,
  showDeleted = false,
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [localShowDeleted, setLocalShowDeleted] = useState(showDeleted);
  console.log("🚀 ~ users:", users);
  const columns = [
    {
      accessorKey: "createdAt",
      header: "Створено",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return `${date.getDate().toString().padStart(2, "0")}.${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}.${date.getFullYear()}`;
      },
    },
    {
      accessorKey: "name",
      header: "Ім’я",
      cell: ({ row }) =>
        editingId === row.original._id ? (
          <input
            value={editData.name ?? row.original.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="p-1 border rounded w-full"
          />
        ) : (
          row.original.name
        ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.original.email,
    },
    {
      accessorKey: "role",
      header: "Роль",
      cell: ({ row }) =>
        editingId === row.original._id ? (
          <select
            value={editData.role ?? row.original.role}
            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
            className="p-1 border rounded w-full"
          >
            <option value="user">Користувач</option>
            <option value="moderator">Модератор</option>
            <option value="admin">Адміністратор</option>
          </select>
        ) : (
          {
            user: "Користувач",
            moderator: "Модератор",
            admin: "Адміністратор",
          }[row.original.role]
        ),
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) =>
        editingId === row.original._id ? (
          <select
            value={editData.status ?? row.original.status}
            onChange={(e) =>
              setEditData({ ...editData, status: e.target.value })
            }
            className="p-1 border rounded w-full"
          >
            <option value="pending">В очікуванні</option>
            <option value="active">Активний</option>
          </select>
        ) : (
          {
            pending: "В очікуванні",
            active: "Активний",
          }[row.original.status]
        ),
    },
    {
      accessorKey: "isDeleted",
      header: "Видалений",
      cell: ({ row }) =>
        editingId === row.original._id ? (
          <input
            type="checkbox"
            checked={editData.isDeleted ?? row.original.isDeleted}
            onChange={(e) =>
              setEditData({ ...editData, isDeleted: e.target.checked })
            }
          />
        ) : row.original.isDeleted ? (
          "Так"
        ) : (
          "Ні"
        ),
    },
    {
      id: "actions",
      header: "Дії",
      cell: ({ row }) => (
        <div className="flex justify-end space-x-2">
          {editingId === row.original._id ? (
            <>
              <button
                onClick={() => handleSave(row.original._id)}
                className="text-green-600 hover:text-green-800"
                title="Зберегти"
              >
                💾
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-600 hover:text-gray-800"
                title="Скасувати"
              >
                ❌
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditingId(row.original._id);
                  setEditData({
                    name: row.original.name,
                    role: row.original.role,
                    status: row.original.status,
                    isDeleted: row.original.isDeleted,
                  });
                }}
                className="text-blue-600 hover:text-blue-800"
                title="Редагувати"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(row.original._id)}
                className="text-red-600 hover:text-red-800"
                title="Позначити як видалений"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: Array.isArray(users) ? users : [], // Захист
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10, pageIndex: page - 1 } },
  });

  const handleSave = async (id) => {
    // console.log("Saving user with id:", id, "data:", editData);
    try {
      // Копіюємо editData, видаляємо порожнє name
      const dataToSend = { ...editData };
      if (dataToSend.name === "") {
        delete dataToSend.name;
      }
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (res.ok) {
        setEditingId(null);
        router.push(
          `/admin/users?page=${page}&filter=${encodeURIComponent(
            filter,
          )}&showDeleted=${localShowDeleted}`,
        );
      } else {
        const text = await res.text();
        console.error("Помилка оновлення користувача:", {
          status: res.status,
          statusText: res.statusText,
          response: text,
        });
        try {
          const errorData = JSON.parse(text);
          console.error("Додаткова інформація:", errorData);
        } catch (jsonError) {
          console.error("Не вдалося розпарсити JSON:", jsonError);
        }
      }
    } catch (error) {
      console.error("Критична помилка:", error);
    }
  };

  const handleDelete = async (id) => {
    // console.log("Deleting user with id:", id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push(
          `/admin/users?page=${page}&filter=${encodeURIComponent(
            filter,
          )}&showDeleted=${localShowDeleted}`,
        );
      } else {
        const text = await res.text();
        console.error("Помилка видалення користувача:", {
          status: res.status,
          statusText: res.statusText,
          response: text,
        });
        try {
          const errorData = JSON.parse(text);
          console.error("Додаткова інформація:", errorData);
        } catch (jsonError) {
          console.error("Не вдалося розпарсити JSON:", jsonError);
        }
      }
    } catch (error) {
      console.error("Критична помилка:", error);
    }
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    router.push(
      `/admin/users?page=1&filter=${encodeURIComponent(
        newFilter,
      )}&showDeleted=${localShowDeleted}`,
    );
  };

  const handleShowDeleted = () => {
    const newShowDeleted = !localShowDeleted;
    setLocalShowDeleted(newShowDeleted);
    router.push(
      `/admin/users?page=1&filter=${encodeURIComponent(
        filter,
      )}&showDeleted=${newShowDeleted}`,
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <input
          value={filter}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded-md"
          placeholder="Пошук за ім’ям або email..."
        />
        <button
          onClick={handleShowDeleted}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-orange-200/20"
        >
          {localShowDeleted ? "Сховати видалених" : "Показати видалених"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/30">
          <thead className="bg-gray-50/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white/10 divide-y divide-gray-200">
            {table.getRowModel()?.rows?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap align-top"
                    >
                      <div className="flex flex-col space-y-1">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                        {cell.column.id !== "actions" &&
                          cell.column.id !== "email" && (
                            <div className="text-sm text-gray-800">
                              {cell.column.id === "email" && (
                                <span>Email: {row.original.email}</span>
                              )}
                              {row.original.nickname && (
                                <span>Нікнейм: {row.original.nickname}</span>
                              )}
                              {row.original.position && (
                                <span>Посада: {row.original.position}</span>
                              )}
                              {row.original.placeOfWork && (
                                <span>
                                  Місце роботи: {row.original.placeOfWork}
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Немає користувачів
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() =>
            router.push(
              `/admin/users?page=${page - 1}&filter=${encodeURIComponent(
                filter,
              )}&showDeleted=${localShowDeleted}`,
            )
          }
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200/10 rounded disabled:opacity-50"
        >
          Попередня
        </button>
        <span>
          Сторінка {page} із {Math.ceil(total / 10)}
        </span>
        <button
          onClick={() =>
            router.push(
              `/admin/users?page=${page + 1}&filter=${encodeURIComponent(
                filter,
              )}&showDeleted=${localShowDeleted}`,
            )
          }
          disabled={page >= Math.ceil(total / 10)}
          className="px-4 py-2 bg-gray-200/10 rounded disabled:opacity-50"
        >
          Наступна
        </button>
      </div>
    </div>
  );
}
