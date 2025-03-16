"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/providers/AuthProvider";
import fetchWithAuth from "@/utils/fetchWithAuth";
import DocumentsTable from "@/components/admin/DocumentsTable";
import AddDocumentForm from "@/components/admin/AddDocumentForm";

export default function AdminDocuments() {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    isArchived: false,
    onlyForShareholders: false,
  });

  const fetchDocuments = async () => {
    const data = await fetchWithAuth("/api/documents");
    if (data) setDocuments(data);
  };

  useEffect(() => {
    setNewDocument((prev) => ({ ...prev, uploadedBy: user?._id }));
  }, [user]);

  useEffect(() => {
    const fetchData = async () => await fetchDocuments();
    fetchData();
  }, []);

  const handleUpdate = async (id, field, value) => {
    console.log(`🔄 Оновлення документа ${id}: ${field} ->`, value);
    const response = await fetchWithAuth(`/api/documents/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ [field]: value }),
    });

    if (response) {
      console.log("✅ Документ успішно оновлено!");
      fetchDocuments();
    } else {
      console.error("❌ Помилка оновлення документа!");
    }
  };

  const handleAddDocument = async () => {
    console.log("📤 Відправка нового документа:", newDocument);

    const response = await fetchWithAuth("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDocument),
    });

    if (response?.error) {
      console.error("❌ Помилка при додаванні:", response.error);
      return;
    }

    console.log("✅ Документ додано:", response.message);
    fetchDocuments();
    setIsAdding(false);
    setNewDocument({
      title: "",
      description: "",
      category: "",
      subcategory: "",
      isArchived: false,
      onlyForShareholders: false,
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Адміністрування документів
      </h1>

      <button
        onClick={() => setIsAdding(true)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Додати документ
      </button>

      {isAdding && (
        <AddDocumentForm
          newDocument={newDocument}
          setNewDocument={setNewDocument}
          onSave={handleAddDocument}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <DocumentsTable documents={documents} onUpdate={handleUpdate} />
    </div>
  );
}
