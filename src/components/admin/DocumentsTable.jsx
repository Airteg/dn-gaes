import DocumentRow from "./DocumentRow";

export default function DocumentsTable({ documents, onUpdate }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100/30">
            <th className="p-2 border">Назва</th>
            <th className="p-2 border">Категорія</th>
            <th className="p-2 border">Опис</th>
            <th className="p-2 border">Архів</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <DocumentRow key={doc._id} doc={doc} onUpdate={onUpdate} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
