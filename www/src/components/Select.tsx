export function GridSelect({
  values,
  onChange,
  options,
  renderOption,
  multi,
  getkey,
  isSelected,
}) {
  return (
    <div className={"flex flex-row gap-1 flex-wrap w-full"}>
      {options.map((option, index, array) => {
        return (
          <Option
            key={getkey(options)}
            value={option}
            onClick={() => {
              let newvalues = isSelected(option)?values.filter((value, index, array) => getkey(value)!=getkey(options)):[...values, option];
              onChange(newvalues);
            }}
            isSelected={isSelected}
            renderOption={renderOption}
          />
        );
      })}
    </div>
  );
}
function Option({ value, onClick, isSelected, renderOption }) {
  let active = isSelected(value);
  return (
    <div
      onClick={onClick}
      className={`bg-white cursor-pointer flex flex-col gap-1 w-fit h-fit  items-center rounded-md border border-gray-300 shadow-sm p-3 overflow-clip ${active ? "bg-blue-300 " : ""}`}
    >
      {renderOption(value)}
    </div>
  );
}
