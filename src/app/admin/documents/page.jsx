"use client";

import { useState } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import DocumentsTable from "@/components/admin/documents/DocumentsTable";
import AddDocumentModal from "@/components/admin/documents/AddDocumentModal";

export default function DocumentsPage() {
  const { data: documents = [], isLoading, error } = useDocuments();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>❌ Помилка: {error.message}</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Документи</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ➕ Додати документ
        </button>
      </div>

      <DocumentsTable documents={documents} />

      <AddDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
