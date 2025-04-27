const PageHeader = ({ title, subtitle, className = "" }) => {
  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <h1 className="text-2xl font-bold text-left mb-6">{title}</h1>
      <h1 className="sr-only">
        Документи, що регламентують діяльність ПрАТ "Нижньодністровська ГЕС"
      </h1>
      <h6 className="text-sm text-left mb-4">
        <span>{subtitle}</span>
      </h6>
    </div>
  );
};

export default PageHeader;
