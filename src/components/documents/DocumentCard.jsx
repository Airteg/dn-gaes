const DocumentCard = ({ title, description, filePath, className = "" }) => {
  return (
    <div className={`w-full md:w-1/3 xl:w-1/3  aspect-[5/3] ${className}`}>
      <div
        className={`rounded-xl m-1 h-full overflow-hidden cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:animate-scale-bounce`}
      >
        <div className="document-card p-5 h-full flex flex-col items-start justify-between">
          <h4 className="text-[var(--t-color)]">{title}</h4>
          <p className="text-[var(--p-color)] text-sm mb-2">{description}</p>
          <a
            href={filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="-1 -1 20.8 12.2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M0 5.6c1.274 3.2456 5.065 5.6 9.542 5.6 4.478 0 8.268-2.3544 9.542-5.6C17.81 2.3544 14.02 0 9.542 0 5.065 0 1.274 2.3544 0 5.6Zm12.542 0a1 1 0 01-6 0 1 1 0 016 0Z"
              />
            </svg>
            <span className="hidden group-hover:inline">Відкрити документ</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
