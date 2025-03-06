export default function DocumentRow({
  documentName = "No Name",
  description = "No Description",
  creationDate = "N/A",
  recentChangesDate = "N/A",
  fileName = "No File",
}) {
  return (
    <div
      className={`grid 
        grid-cols-[4fr_6fr_minmax(7rem,1fr)_minmax(7rem,1fr)_minmax(10rem,1fr)]
        grid-auto-rows-auto
        max-lg:grid-cols-[6fr_minmax(7rem,1fr)_minmax(7rem,1fr)_minmax(10rem,1fr)]
        max-md:grid-cols-[minmax(7rem,1fr)_minmax(7rem,1fr)_minmax(10rem,1fr)]
        max-sm:grid-cols-1
        gap-1
        p-4 bg-[#171717] text-[#ededed] rounded-lg shadow-lg
        hover:bg-[#2c2c2c] transition-colors`}
    >
      <div className="max-md:col-span-3 max-lg:col-span-4 p-3 flex items-center bg-[#252a33] rounded-md shadow-md font-semibold text-sm">
        {documentName}
      </div>
      <div className="max-md:col-span-3 p-3 flex items-center bg-[#252a33] rounded-md shadow-md text-sm">
        {description}
      </div>
      <div className="justify-center p-3 flex items-center bg-[#252a33] rounded-md shadow-md text-sm">
        {creationDate}
      </div>
      <div className="justify-center p-3 flex items-center bg-[#252a33] rounded-md shadow-md text-sm">
        {recentChangesDate}
      </div>
      <div className="justify-center p-3 flex items-center bg-[#252a33] rounded-md shadow-md text-sm">
        {fileName}
      </div>
    </div>
  );
}
