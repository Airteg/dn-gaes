import DocumentCard from "./DocumentCard";

const DocumentGrid = ({ documents, className = "" }) => {
  return (
    <div className={`${className}`}>
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
