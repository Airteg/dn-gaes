import { FileText, FileArchive, File, FileCode, FilePdf } from "lucide-react";

const fileIcons = {
  pdf: FilePdf,
  docx: FileText,
  txt: FileCode,
  zip: FileArchive,
  default: File,
};

export default function FileIcon({ filename, size = 20 }) {
  const extension = filename.split(".").pop().toLowerCase();
  const IconComponent = fileIcons[extension] || fileIcons.default;
  return <IconComponent size={size} className="text-gray-500" />;
}
