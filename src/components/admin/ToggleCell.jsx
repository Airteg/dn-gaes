export default function ToggleCell({ doc, field, onUpdate }) {
  return (
    <td className="p-2 border text-center">
      <button
        className={`px-2 py-1 rounded ${
          doc[field] ? "bg-green-500 text-white" : "bg-gray-300/30"
        }`}
        onClick={() => onUpdate(doc._id, field, !doc[field])}
      >
        {doc[field] ? "✓" : "✗"}
      </button>
    </td>
  );
}
