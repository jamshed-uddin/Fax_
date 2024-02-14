import useTheme from "../hooks/useTheme";

const WentWrong = ({ refetch }) => {
  const { dark } = useTheme();
  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col items-center">
        <h1 className="text-xl">Something went wrong</h1>
        <button
          className={`text-lg  rounded-lg mt-1 cursor-pointer px-3 pb-1  ${
            dark ? "bg-slate-100 text-gray-800" : "bg-slate-900 text-slate-100"
          }`}
          onClick={refetch}
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default WentWrong;
