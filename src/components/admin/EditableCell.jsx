import { useState, useEffect } from "react";

export default function EditableCell({ doc, field, onUpdate }) {
  const [value, setValue] = useState(doc[field]);

  useEffect(() => {
    setValue(doc[field]);
  }, [doc, field]);

  return (
    <td className="p-2 border">
      <input
        className="w-full p-1 border border-gray-300 rounded"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onUpdate(doc._id, field, value)}
      />
    </td>
  );
}
