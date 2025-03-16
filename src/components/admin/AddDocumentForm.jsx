import UploadDocument from "@/components/admin/UploadDocument";

export default function AddDocumentForm({
  newDocument,
  setNewDocument,
  onSave,
  onCancel,
}) {
  return (
    <div className="p-4 border border-gray-300 mb-4">
      <h2 className="text-lg font-bold mb-2">Новий документ</h2>
      <input
        type="text"
        placeholder="Назва"
        value={newDocument.title}
        onChange={(e) =>
          setNewDocument({ ...newDocument, title: e.target.value })
        }
        className="border p-2 w-full mb-2"
      />
      <UploadDocument
        onUpload={(filePath) =>
          setNewDocument((prev) => ({ ...prev, filePath }))
        }
      />
      <button
        onClick={onSave}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        Зберегти
      </button>
      <button
        onClick={onCancel}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Скасувати
      </button>
    </div>
  );
}
