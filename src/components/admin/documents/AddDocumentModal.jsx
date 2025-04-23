"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useDraggable } from "@dnd-kit/core";

export default function AddDocumentModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    description: "",
    filePath: "",
    category: "",
  });

  const handleSubmit = async () => {
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: "", description: "", filePath: "", category: "" });

      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      onClose();
    } else {
      console.error("Помилка створення документа", await res.text());
    }
  };

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "modal",
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          ref={setNodeRef}
          style={style}
          className="bg-gray-700 max-w-md w-full p-4 rounded-md shadow-xl space-y-4 cursor-move"
          {...attributes}
          {...listeners}
        >
          <DialogTitle className="text-lg font-bold">
            Додати документ
          </DialogTitle>

          <input
            type="text"
            placeholder="Назва"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Категорія"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border rounded p-2"
          />
          <textarea
            placeholder="Опис"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Посилання на файл"
            value={form.filePath}
            onChange={(e) => setForm({ ...form, filePath: e.target.value })}
            className="w-full border rounded p-2"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Скасувати
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Додати
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
