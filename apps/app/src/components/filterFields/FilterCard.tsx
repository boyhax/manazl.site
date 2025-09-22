

export default function ({ title, value }) {
  return (
    <div
    onClick={()=>{}}
      className={
        "flex flex-col items-center  p-2 w-1/3 h-20 border border-slate-300 rounded-md"
      }
    >
      <label >{title}</label>
      <p
        className={
          "font-semibold cursor-pointer  overflow-hidden text-wrap text-sm truncate"
        }
      >
        {value ? value : null}
      </p>
    </div>
  );
}
