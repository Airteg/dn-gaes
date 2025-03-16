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

      {/* Поле для назви документа */}
      <input
        type="text"
        placeholder="Назва"
        value={newDocument.title}
        onChange={(e) =>
          setNewDocument({ ...newDocument, title: e.target.value })
        }
        className="border p-2 w-full mb-2"
      />

      {/* Поле для опису */}
      <input
        type="text"
        placeholder="Опис"
        value={newDocument.description}
        onChange={(e) =>
          setNewDocument({ ...newDocument, description: e.target.value })
        }
        className="border p-2 w-full mb-2"
      />

      {/* Поле для категорії */}
      <input
        type="text"
        placeholder="Категорія"
        value={newDocument.category}
        onChange={(e) =>
          setNewDocument({ ...newDocument, category: e.target.value })
        }
        className="border p-2 w-full mb-2"
      />

      {/* Поле для підкатегорії */}
      <input
        type="text"
        placeholder="Підкатегорія"
        value={newDocument.subcategory}
        onChange={(e) =>
          setNewDocument({ ...newDocument, subcategory: e.target.value })
        }
        className="border p-2 w-full mb-2"
      />

      {/* Поле завантаження документа */}
      <UploadDocument
        onUpload={(filePath) =>
          setNewDocument((prev) => ({ ...prev, filePath }))
        }
      />

      {/* Чекбокс: Архівований документ */}
      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          checked={newDocument.isArchived}
          onChange={(e) =>
            setNewDocument({ ...newDocument, isArchived: e.target.checked })
          }
          className="mr-2"
        />
        <label>Архівований</label>
      </div>

      {/* Чекбокс: Тільки для акціонерів */}
      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          checked={newDocument.shareholdersOnly}
          onChange={(e) =>
            setNewDocument({
              ...newDocument,
              shareholdersOnly: e.target.checked,
            })
          }
          className="mr-2"
        />
        <label>Тільки для акціонерів</label>
      </div>

      {/* Кнопки дій */}
      <div className="mt-4">
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
    </div>
  );
}
