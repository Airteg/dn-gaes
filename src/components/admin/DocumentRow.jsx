import EditableCell from "./EditableCell";
import ToggleCell from "./ToggleCell";

export default function DocumentRow({ doc, onUpdate }) {
  return (
    <tr className="border">
      <EditableCell doc={doc} field="title" onUpdate={onUpdate} />
      <EditableCell doc={doc} field="category" onUpdate={onUpdate} />
      <EditableCell doc={doc} field="description" onUpdate={onUpdate} />
      <ToggleCell doc={doc} field="isArchived" onUpdate={onUpdate} />
    </tr>
  );
}
