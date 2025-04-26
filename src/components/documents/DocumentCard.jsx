const DocumentCard = ({ title, description, filePath, className = "" }) => {
  return (
    <div className={`p-4 bg-white/10 shadow-md rounded-md ${className}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-300 text-sm mb-2">{description}</p>
      <a
        href={filePath}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Відкрити документ
      </a>
    </div>
  );
};

export default DocumentCard;
