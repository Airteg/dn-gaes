import DocumentCard from "./DocumentCard";

const DocumentGrid = ({ documents, className = "" }) => {
  console.log("🚀 ~ documents:", documents);
  return (
    <div
      className={`flex flex-wrap w-full xl:grow xl:shrink-0 xl:basis-0 p-2 ${className}`}
    >
      {documents.map((doc) => (
        <DocumentCard
          key={doc._id}
          title={doc.title}
          description={doc.description}
          updatedAt={doc.updatedAt}
          filePath={doc.filePath}
        />
      ))}
    </div>
  );
};

export default DocumentGrid;
