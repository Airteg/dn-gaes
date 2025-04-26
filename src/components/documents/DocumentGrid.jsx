import DocumentCard from "./DocumentCard";

const DocumentGrid = ({ documents, className = "" }) => {
  return (
    <div
      className={`mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {documents.map((doc) => (
        <DocumentCard
          key={doc._id}
          title={doc.title}
          description={doc.description}
          filePath={doc.filePath}
        />
      ))}
    </div>
  );
};

export default DocumentGrid;
