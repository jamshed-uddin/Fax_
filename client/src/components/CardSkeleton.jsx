import useTheme from "../hooks/useTheme";

const CardSkeleton = ({ cardAmount }) => {
  const { dark } = useTheme();
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6, 7].slice(0, cardAmount).map((el) => (
        <div
          key={el}
          className={`skeleton  h-14 w-full  rounded-lg ${
            dark ? "bg-slate-800" : "bg-slate-200"
          }`}
        ></div>
      ))}
    </div>
  );
};

export default CardSkeleton;
